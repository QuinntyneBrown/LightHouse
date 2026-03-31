import type { FastifyRequest, FastifyReply } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { ScreenTimeLimitError, NotFoundError } from "../utils/errors.js";

declare module "fastify" {
  interface FastifyRequest {
    screenTimeRemaining?: number;
  }
}

export function screenTimeCheck(prisma: PrismaClient) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const profileId =
      (request.params as { profileId?: string }).profileId ??
      (request.query as { profileId?: string }).profileId;

    if (!profileId) return;

    const profile = await prisma.childProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundError("ChildProfile", profileId);
    }

    const now = new Date();
    const dayOfWeek = now.getDay();

    const rule = await prisma.screenTimeRule.findUnique({
      where: {
        childProfileId_dayOfWeek: {
          childProfileId: profileId,
          dayOfWeek,
        },
      },
    });

    // No rule means no limit
    if (!rule) {
      request.screenTimeRemaining = Infinity;
      return;
    }

    // Check time window
    if (rule.startTime && rule.endTime) {
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      if (currentTime < rule.startTime || currentTime > rule.endTime) {
        throw new ScreenTimeLimitError(0);
      }
    }

    // Calculate elapsed minutes today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const sessions = await prisma.screenTimeSession.findMany({
      where: {
        childProfileId: profileId,
        startedAt: { gte: startOfDay },
      },
    });

    let elapsedMinutes = 0;
    for (const session of sessions) {
      if (session.endedAt) {
        elapsedMinutes += session.durationMinutes;
      } else {
        // Active session: calculate from start to now
        const diff = (now.getTime() - session.startedAt.getTime()) / 60000;
        elapsedMinutes += Math.floor(diff);
      }
    }

    const remaining = rule.dailyLimitMinutes - elapsedMinutes;
    if (remaining <= 0) {
      throw new ScreenTimeLimitError(0);
    }

    request.screenTimeRemaining = remaining;
  };
}
