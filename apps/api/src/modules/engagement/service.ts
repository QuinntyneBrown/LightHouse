import type { PrismaClient } from "@prisma/client";
import { NotFoundError } from "../../utils/errors.js";

export class EngagementService {
  constructor(private prisma: PrismaClient) {}

  async getBadges(profileId: string) {
    const allBadges = await this.prisma.badge.findMany({
      include: {
        children: {
          where: { childProfileId: profileId },
        },
      },
    });

    return allBadges.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      iconUrl: badge.iconUrl,
      criteria: badge.criteria,
      earned: badge.children.length > 0,
      earnedAt: badge.children[0]?.earnedAt.toISOString() ?? null,
    }));
  }

  async getProgress(profileId: string) {
    const profile = await this.prisma.childProfile.findUnique({
      where: { id: profileId },
    });
    if (!profile) throw new NotFoundError("ChildProfile", profileId);

    const metrics = await this.prisma.childProgress.findMany({
      where: { childProfileId: profileId },
    });

    // Calculate streak
    const streakMetric = metrics.find((m) => m.metric === "streak_days");
    const currentStreak = streakMetric?.value ?? 0;

    const longestStreakMetric = metrics.find((m) => m.metric === "longest_streak");
    const longestStreak = longestStreakMetric?.value ?? 0;

    // Total watch time from playback sessions
    const watchTimeResult = await this.prisma.playbackSession.aggregate({
      where: { childProfileId: profileId },
      _sum: { durationSeconds: true },
    });

    // Total completed items
    const completedCount = await this.prisma.watchProgress.count({
      where: { childProfileId: profileId, completed: true },
    });

    return {
      childProfileId: profileId,
      metrics: metrics.map((m) => ({
        metric: m.metric,
        value: m.value,
        lastUpdated: m.lastUpdated.toISOString(),
      })),
      currentStreak,
      longestStreak,
      totalWatchTime: watchTimeResult._sum.durationSeconds ?? 0,
      totalItemsCompleted: completedCount,
    };
  }

  async updateProgress(profileId: string, metric: string, value: number) {
    const progress = await this.prisma.childProgress.upsert({
      where: {
        childProfileId_metric: {
          childProfileId: profileId,
          metric,
        },
      },
      create: {
        childProfileId: profileId,
        metric,
        value,
      },
      update: {
        value,
        lastUpdated: new Date(),
      },
    });

    // Check badge eligibility
    await this.checkBadgeEligibility(profileId);

    return progress;
  }

  async recordStreak(profileId: string) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // Check if user had activity yesterday
    const yesterdayActivity = await this.prisma.viewHistoryEntry.findFirst({
      where: {
        childProfileId: profileId,
        watchedAt: {
          gte: yesterday,
          lt: todayStart,
        },
      },
    });

    const streakProgress = await this.prisma.childProgress.findUnique({
      where: {
        childProfileId_metric: {
          childProfileId: profileId,
          metric: "streak_days",
        },
      },
    });

    let newStreak = 1;
    if (yesterdayActivity && streakProgress) {
      newStreak = streakProgress.value + 1;
    }

    await this.prisma.childProgress.upsert({
      where: {
        childProfileId_metric: {
          childProfileId: profileId,
          metric: "streak_days",
        },
      },
      create: {
        childProfileId: profileId,
        metric: "streak_days",
        value: newStreak,
      },
      update: {
        value: newStreak,
        lastUpdated: new Date(),
      },
    });

    // Update longest streak
    const longestStreak = await this.prisma.childProgress.findUnique({
      where: {
        childProfileId_metric: {
          childProfileId: profileId,
          metric: "longest_streak",
        },
      },
    });

    if (!longestStreak || newStreak > longestStreak.value) {
      await this.prisma.childProgress.upsert({
        where: {
          childProfileId_metric: {
            childProfileId: profileId,
            metric: "longest_streak",
          },
        },
        create: {
          childProfileId: profileId,
          metric: "longest_streak",
          value: newStreak,
        },
        update: {
          value: newStreak,
          lastUpdated: new Date(),
        },
      });
    }

    return { currentStreak: newStreak };
  }

  async getMemoryVerseOfDay(profileId: string) {
    const profile = await this.prisma.childProfile.findUnique({
      where: { id: profileId },
    });
    if (!profile) throw new NotFoundError("ChildProfile", profileId);

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    const verse = await this.prisma.memoryVerse.findFirst({
      where: {
        ageBand: profile.ageBand,
        dayOfYear: dayOfYear > 0 ? dayOfYear : 1,
      },
      include: {
        completions: {
          where: { childProfileId: profileId },
        },
      },
    });

    if (!verse) {
      // Fallback: get any verse for this age band
      const fallback = await this.prisma.memoryVerse.findFirst({
        where: { ageBand: profile.ageBand },
        include: {
          completions: {
            where: { childProfileId: profileId },
          },
        },
      });

      if (!fallback) return null;

      return {
        id: fallback.id,
        reference: fallback.reference,
        text: fallback.text,
        ageBand: fallback.ageBand,
        completed: fallback.completions.length > 0,
        completedAt: fallback.completions[0]?.completedAt.toISOString() ?? null,
      };
    }

    return {
      id: verse.id,
      reference: verse.reference,
      text: verse.text,
      ageBand: verse.ageBand,
      completed: verse.completions.length > 0,
      completedAt: verse.completions[0]?.completedAt.toISOString() ?? null,
    };
  }

  async completeVerse(profileId: string, memoryVerseId: string) {
    const verse = await this.prisma.memoryVerse.findUnique({
      where: { id: memoryVerseId },
    });
    if (!verse) throw new NotFoundError("MemoryVerse", memoryVerseId);

    const completion = await this.prisma.memoryVerseCompletion.upsert({
      where: {
        childProfileId_memoryVerseId: {
          childProfileId: profileId,
          memoryVerseId,
        },
      },
      create: {
        childProfileId: profileId,
        memoryVerseId,
      },
      update: {},
    });

    // Update verses_completed metric
    const completedCount = await this.prisma.memoryVerseCompletion.count({
      where: { childProfileId: profileId },
    });

    await this.updateProgress(profileId, "verses_completed", completedCount);

    return {
      id: completion.id,
      memoryVerseId,
      completedAt: completion.completedAt.toISOString(),
    };
  }

  private async checkBadgeEligibility(profileId: string) {
    const progress = await this.prisma.childProgress.findMany({
      where: { childProfileId: profileId },
    });

    const progressMap = new Map(progress.map((p) => [p.metric, p.value]));

    const badges = await this.prisma.badge.findMany({
      include: {
        rules: true,
        children: {
          where: { childProfileId: profileId },
        },
      },
    });

    for (const badge of badges) {
      // Skip if already earned
      if (badge.children.length > 0) continue;

      // Check all rules
      const allMet = badge.rules.every((rule) => {
        const currentValue = progressMap.get(rule.metric) ?? 0;
        return currentValue >= rule.threshold;
      });

      if (allMet && badge.rules.length > 0) {
        await this.prisma.childBadge.create({
          data: {
            childProfileId: profileId,
            badgeId: badge.id,
          },
        });
      }
    }
  }
}
