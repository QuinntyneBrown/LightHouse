import type { PrismaClient } from "@prisma/client";
import { NotFoundError } from "../../utils/errors.js";
import { parsePagination, paginatedResponse } from "../../utils/pagination.js";
import type { ScreenTimeRuleInput, BlockContentInput } from "./schema.js";

export class ParentalControlsService {
  constructor(private prisma: PrismaClient) {}

  async getDashboard(accountId: string) {
    const profiles = await this.prisma.childProfile.findMany({
      where: { accountId },
      include: { avatar: true },
    });

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const summaries = await Promise.all(
      profiles.map(async (profile) => {
        const todaySessions = await this.prisma.screenTimeSession.findMany({
          where: {
            childProfileId: profile.id,
            startedAt: { gte: startOfDay },
          },
        });

        let watchTimeToday = 0;
        for (const session of todaySessions) {
          if (session.endedAt) {
            watchTimeToday += session.durationMinutes;
          } else {
            watchTimeToday += Math.floor(
              (now.getTime() - session.startedAt.getTime()) / 60000
            );
          }
        }

        const dayOfWeek = now.getDay();
        const rule = await this.prisma.screenTimeRule.findUnique({
          where: {
            childProfileId_dayOfWeek: {
              childProfileId: profile.id,
              dayOfWeek,
            },
          },
        });

        const dailyLimit = rule?.dailyLimitMinutes ?? 0;
        const remaining = Math.max(0, dailyLimit - watchTimeToday);

        const lastSession = await this.prisma.playbackSession.findFirst({
          where: { childProfileId: profile.id },
          orderBy: { startedAt: "desc" },
        });

        return {
          profileId: profile.id,
          name: profile.name,
          ageBand: profile.ageBand,
          watchTimeToday,
          screenTimeRemaining: rule ? remaining : -1, // -1 = no limit set
          lastActive: lastSession?.startedAt.toISOString() ?? null,
        };
      })
    );

    const totalWatchTimeToday = summaries.reduce((sum, s) => sum + s.watchTimeToday, 0);

    // Recent activity across all children
    const recentActivity = await this.prisma.viewHistoryEntry.findMany({
      where: {
        childProfileId: { in: profiles.map((p) => p.id) },
      },
      include: {
        content: true,
        childProfile: true,
      },
      orderBy: { watchedAt: "desc" },
      take: 20,
    });

    return {
      childProfiles: summaries,
      totalWatchTimeToday,
      recentActivity: recentActivity.map((entry) => ({
        id: entry.id,
        childProfileId: entry.childProfileId,
        childName: entry.childProfile.name,
        contentId: entry.contentId,
        contentTitle: entry.content.title,
        contentType: entry.content.contentType,
        thumbnailUrl: entry.content.thumbnailUrl,
        watchedAt: entry.watchedAt.toISOString(),
        durationSeconds: entry.durationSeconds,
      })),
    };
  }

  async getScreenTimeRules(accountId: string, profileId: string) {
    await this.verifyProfileOwnership(accountId, profileId);

    return this.prisma.screenTimeRule.findMany({
      where: { childProfileId: profileId },
      orderBy: { dayOfWeek: "asc" },
    });
  }

  async setScreenTimeRules(accountId: string, profileId: string, rules: ScreenTimeRuleInput[]) {
    await this.verifyProfileOwnership(accountId, profileId);

    // Delete existing and recreate
    await this.prisma.screenTimeRule.deleteMany({
      where: { childProfileId: profileId },
    });

    const created = await Promise.all(
      rules.map((rule) =>
        this.prisma.screenTimeRule.create({
          data: {
            childProfileId: profileId,
            dayOfWeek: rule.dayOfWeek,
            dailyLimitMinutes: rule.dailyLimitMinutes,
            startTime: rule.startTime,
            endTime: rule.endTime,
          },
        })
      )
    );

    return created;
  }

  async getScreenTimeStatus(accountId: string, profileId: string) {
    await this.verifyProfileOwnership(accountId, profileId);

    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const rule = await this.prisma.screenTimeRule.findUnique({
      where: {
        childProfileId_dayOfWeek: {
          childProfileId: profileId,
          dayOfWeek,
        },
      },
    });

    if (!rule) {
      return {
        childProfileId: profileId,
        dailyLimitMinutes: 0,
        usedMinutes: 0,
        remainingMinutes: 0,
        isAllowed: true,
        activeSession: false,
      };
    }

    const sessions = await this.prisma.screenTimeSession.findMany({
      where: {
        childProfileId: profileId,
        startedAt: { gte: startOfDay },
      },
    });

    let usedMinutes = 0;
    let hasActiveSession = false;
    for (const session of sessions) {
      if (session.endedAt) {
        usedMinutes += session.durationMinutes;
      } else {
        hasActiveSession = true;
        usedMinutes += Math.floor((now.getTime() - session.startedAt.getTime()) / 60000);
      }
    }

    const remaining = Math.max(0, rule.dailyLimitMinutes - usedMinutes);

    let isAllowed = remaining > 0;
    if (rule.startTime && rule.endTime) {
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      if (currentTime < rule.startTime || currentTime > rule.endTime) {
        isAllowed = false;
      }
    }

    return {
      childProfileId: profileId,
      dailyLimitMinutes: rule.dailyLimitMinutes,
      usedMinutes,
      remainingMinutes: remaining,
      isAllowed,
      activeSession: hasActiveSession,
    };
  }

  async blockContent(accountId: string, profileId: string, input: BlockContentInput) {
    await this.verifyProfileOwnership(accountId, profileId);

    const content = await this.prisma.content.findUnique({
      where: { id: input.contentId },
    });
    if (!content) throw new NotFoundError("Content", input.contentId);

    const blocked = await this.prisma.blockedContent.upsert({
      where: {
        childProfileId_contentId: {
          childProfileId: profileId,
          contentId: input.contentId,
        },
      },
      create: {
        childProfileId: profileId,
        contentId: input.contentId,
        reason: input.reason,
      },
      update: {
        reason: input.reason,
      },
      include: { content: true },
    });

    return {
      id: blocked.id,
      contentId: blocked.contentId,
      contentTitle: blocked.content.title,
      reason: blocked.reason,
      createdAt: blocked.createdAt.toISOString(),
    };
  }

  async listBlockedContent(accountId: string, profileId: string) {
    await this.verifyProfileOwnership(accountId, profileId);

    const items = await this.prisma.blockedContent.findMany({
      where: { childProfileId: profileId },
      include: { content: true },
      orderBy: { createdAt: "desc" },
    });

    return items.map((b) => ({
      id: b.id,
      contentId: b.contentId,
      contentTitle: b.content.title,
      reason: b.reason,
      createdAt: b.createdAt.toISOString(),
    }));
  }

  async unblockContent(accountId: string, profileId: string, contentId: string) {
    await this.verifyProfileOwnership(accountId, profileId);

    await this.prisma.blockedContent.deleteMany({
      where: { childProfileId: profileId, contentId },
    });
  }

  async getViewHistory(accountId: string, profileId: string, query: { offset?: number; limit?: number }) {
    await this.verifyProfileOwnership(accountId, profileId);

    const { offset, limit } = parsePagination(query);

    const [items, total] = await Promise.all([
      this.prisma.viewHistoryEntry.findMany({
        where: { childProfileId: profileId },
        include: { content: true, childProfile: true },
        orderBy: { watchedAt: "desc" },
        skip: offset,
        take: limit,
      }),
      this.prisma.viewHistoryEntry.count({
        where: { childProfileId: profileId },
      }),
    ]);

    return paginatedResponse(
      items.map((entry) => ({
        id: entry.id,
        childProfileId: entry.childProfileId,
        childName: entry.childProfile.name,
        contentId: entry.contentId,
        contentTitle: entry.content.title,
        contentType: entry.content.contentType,
        thumbnailUrl: entry.content.thumbnailUrl,
        watchedAt: entry.watchedAt.toISOString(),
        durationSeconds: entry.durationSeconds,
      })),
      total,
      { offset, limit }
    );
  }

  private async verifyProfileOwnership(accountId: string, profileId: string) {
    const profile = await this.prisma.childProfile.findFirst({
      where: { id: profileId, accountId },
    });
    if (!profile) {
      throw new NotFoundError("ChildProfile", profileId);
    }
    return profile;
  }
}
