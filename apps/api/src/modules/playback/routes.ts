import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import type { AppConfig } from "../../config.js";
import { PlaybackService } from "./service.js";
import { PlaybackController } from "./controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { screenTimeCheck } from "../../middleware/screen-time-check.js";

export async function playbackRoutes(app: FastifyInstance, prisma: PrismaClient, config: AppConfig) {
  const service = new PlaybackService(prisma, {
    endPoint: config.minioEndpoint,
    port: config.minioPort,
    accessKey: config.minioAccessKey,
    secretKey: config.minioSecretKey,
    useSSL: config.minioUseSSL,
    bucket: config.minioBucket,
  });
  const controller = new PlaybackController(service);

  app.get("/playback/stream", { preHandler: [authenticate, screenTimeCheck(prisma)] }, controller.stream);
  app.post("/playback/:profileId/progress", { preHandler: [authenticate] }, controller.saveProgress);
  app.get("/playback/:profileId/progress/:contentId", { preHandler: [authenticate] }, controller.getProgress);
  app.get("/playback/:profileId/history", { preHandler: [authenticate] }, controller.history);
}
