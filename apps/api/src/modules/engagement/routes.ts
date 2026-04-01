import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { EngagementService } from "./service.js";
import { EngagementController } from "./controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function engagementRoutes(app: FastifyInstance, prisma: PrismaClient) {
  const service = new EngagementService(prisma);
  const controller = new EngagementController(service);

  app.get("/engagement/:profileId/badges", { preHandler: [authenticate] }, controller.badges);
  app.get("/engagement/:profileId/progress", { preHandler: [authenticate] }, controller.progress);
  app.post("/engagement/:profileId/progress", { preHandler: [authenticate] }, controller.updateProgress);
  app.post("/engagement/:profileId/streak", { preHandler: [authenticate] }, controller.streak);
  app.get("/engagement/:profileId/memory-verse", { preHandler: [authenticate] }, controller.memoryVerseOfDay);
  app.post("/engagement/:profileId/memory-verse/complete", { preHandler: [authenticate] }, controller.completeVerse);
}
