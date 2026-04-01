import type { PrismaClient, ChurchStatus, AdminRole } from "@prisma/client";
import { NotFoundError } from "../../utils/errors.js";
import type {
  ChurchAccountCreateInput,
  ReviewerManageInput,
  SystemConfigInput,
} from "./schema.js";

export class AdminService {
  constructor(private prisma: PrismaClient) {}

  async getAnalyticsOverview() {
    const [
      totalAccounts,
      totalChildProfiles,
      totalContent,
      totalPlaybackSessions,
      watchTimeAgg,
    ] = await Promise.all([
      this.prisma.account.count(),
      this.prisma.childProfile.count(),
      this.prisma.content.count(),
      this.prisma.playbackSession.count(),
      this.prisma.playbackSession.aggregate({
        _sum: { durationSeconds: true },
      }),
    ]);

    const totalWatchTimeMinutes = Math.floor(
      (watchTimeAgg._sum.durationSeconds ?? 0) / 60
    );

    // Active users today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const activeUsersToday = await this.prisma.playbackSession.findMany({
      where: { startedAt: { gte: startOfDay } },
      select: { childProfileId: true },
      distinct: ["childProfileId"],
    });

    // Content by status
    const contentByStatus = await this.prisma.content.groupBy({
      by: ["status"],
      _count: { id: true },
    });
    const statusMap: Record<string, number> = {};
    for (const item of contentByStatus) {
      statusMap[item.status] = item._count.id;
    }

    // Content by type
    const contentByType = await this.prisma.content.groupBy({
      by: ["contentType"],
      _count: { id: true },
    });
    const typeMap: Record<string, number> = {};
    for (const item of contentByType) {
      typeMap[item.contentType] = item._count.id;
    }

    // Top content by play count
    const topContentRaw = await this.prisma.playbackSession.groupBy({
      by: ["contentId"],
      _count: { id: true },
      _sum: { durationSeconds: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });

    const topContentIds = topContentRaw.map((tc) => tc.contentId);
    const topContentDetails = await this.prisma.content.findMany({
      where: { id: { in: topContentIds } },
    });
    const contentMap = new Map(topContentDetails.map((c) => [c.id, c]));

    const topContent = topContentRaw.map((tc) => ({
      contentId: tc.contentId,
      title: contentMap.get(tc.contentId)?.title ?? "Unknown",
      playCount: tc._count.id,
      totalWatchTimeMinutes: Math.floor((tc._sum.durationSeconds ?? 0) / 60),
    }));

    return {
      totalAccounts,
      totalChildProfiles,
      totalContent,
      totalPlaybackSessions,
      totalWatchTimeMinutes,
      activeUsersToday: activeUsersToday.length,
      contentByStatus: statusMap,
      contentByType: typeMap,
      topContent,
    };
  }

  async getContentAnalytics(contentId: string) {
    const content = await this.prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!content) throw new NotFoundError("Content", contentId);

    const sessions = await this.prisma.playbackSession.findMany({
      where: { contentId },
    });

    const uniqueViewers = new Set(sessions.map((s) => s.childProfileId)).size;
    const totalWatchSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
    const playCount = sessions.length;

    const completedCount = await this.prisma.watchProgress.count({
      where: { contentId, completed: true },
    });

    const totalProgressEntries = await this.prisma.watchProgress.count({
      where: { contentId },
    });

    const completionRate = totalProgressEntries > 0
      ? (completedCount / totalProgressEntries) * 100
      : 0;

    return {
      contentId,
      title: content.title,
      playCount,
      uniqueViewers,
      totalWatchTimeMinutes: Math.floor(totalWatchSeconds / 60),
      averageWatchTimeMinutes: playCount > 0 ? Math.floor(totalWatchSeconds / 60 / playCount) : 0,
      completionRate: Math.round(completionRate * 100) / 100,
    };
  }

  async getUsageMetrics(from?: string, to?: string) {
    const endDate = to ? new Date(to) : new Date();
    const startDate = from ? new Date(from) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dates: string[] = [];
    const dailyActiveUsers: number[] = [];
    const dailyPlaybackSessions: number[] = [];
    const dailyWatchTimeMinutes: number[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      dates.push(dayStart.toISOString().split("T")[0]);

      const [activeUsers, sessionCount, watchTimeAgg] = await Promise.all([
        this.prisma.playbackSession.findMany({
          where: { startedAt: { gte: dayStart, lte: dayEnd } },
          select: { childProfileId: true },
          distinct: ["childProfileId"],
        }),
        this.prisma.playbackSession.count({
          where: { startedAt: { gte: dayStart, lte: dayEnd } },
        }),
        this.prisma.playbackSession.aggregate({
          where: { startedAt: { gte: dayStart, lte: dayEnd } },
          _sum: { durationSeconds: true },
        }),
      ]);

      dailyActiveUsers.push(activeUsers.length);
      dailyPlaybackSessions.push(sessionCount);
      dailyWatchTimeMinutes.push(Math.floor((watchTimeAgg._sum.durationSeconds ?? 0) / 60));

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      period: `${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}`,
      dailyActiveUsers,
      dailyPlaybackSessions,
      dailyWatchTimeMinutes,
      dates,
    };
  }

  // Church Account Management
  async listChurchAccounts() {
    const churches = await this.prisma.churchAccount.findMany({
      include: { _count: { select: { admins: true } } },
      orderBy: { createdAt: "desc" },
    });

    return churches.map((c) => ({
      id: c.id,
      name: c.name,
      website: c.website,
      contactEmail: c.contactEmail,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      adminCount: c._count.admins,
    }));
  }

  async createChurchAccount(input: ChurchAccountCreateInput) {
    const church = await this.prisma.churchAccount.create({
      data: {
        name: input.name,
        website: input.website,
        contactEmail: input.contactEmail,
      },
      include: { _count: { select: { admins: true } } },
    });

    return {
      id: church.id,
      name: church.name,
      website: church.website,
      contactEmail: church.contactEmail,
      status: church.status,
      createdAt: church.createdAt.toISOString(),
      updatedAt: church.updatedAt.toISOString(),
      adminCount: church._count.admins,
    };
  }

  async updateChurchStatus(churchId: string, status: string) {
    const church = await this.prisma.churchAccount.findUnique({
      where: { id: churchId },
    });
    if (!church) throw new NotFoundError("ChurchAccount", churchId);

    const updated = await this.prisma.churchAccount.update({
      where: { id: churchId },
      data: { status: status as ChurchStatus },
      include: { _count: { select: { admins: true } } },
    });

    return {
      id: updated.id,
      name: updated.name,
      website: updated.website,
      contactEmail: updated.contactEmail,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      adminCount: updated._count.admins,
    };
  }

  // Reviewer Management
  async listReviewers() {
    return this.prisma.adminUser.findMany({
      where: { role: { in: ["REVIEWER", "CONTENT_ADMIN"] } },
      orderBy: { createdAt: "desc" },
    });
  }

  async addReviewer(input: ReviewerManageInput) {
    return this.prisma.adminUser.create({
      data: {
        email: input.email,
        displayName: input.displayName,
        role: input.role as AdminRole,
      },
    });
  }

  async removeReviewer(adminId: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
    });
    if (!admin) throw new NotFoundError("AdminUser", adminId);

    await this.prisma.adminUser.delete({ where: { id: adminId } });
  }

  // System Config
  async getSystemConfig() {
    return this.prisma.systemConfig.findMany();
  }

  async setSystemConfig(input: SystemConfigInput) {
    return this.prisma.systemConfig.upsert({
      where: { key: input.key },
      create: { key: input.key, value: input.value },
      update: { value: input.value },
    });
  }
}
