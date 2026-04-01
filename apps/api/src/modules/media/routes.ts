import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import type { AppConfig } from "../../config.js";
import { MediaService } from "./service.js";
import { MediaController } from "./controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

export async function mediaRoutes(app: FastifyInstance, prisma: PrismaClient, config: AppConfig) {
  const service = new MediaService(prisma, {
    endPoint: config.minioEndpoint,
    port: config.minioPort,
    accessKey: config.minioAccessKey,
    secretKey: config.minioSecretKey,
    useSSL: config.minioUseSSL,
    bucket: config.minioBucket,
  });
  const controller = new MediaController(service);

  const adminAuth = [authenticate, authorize("SUPER_ADMIN", "CONTENT_ADMIN")];

  app.post("/media/upload-url", { preHandler: adminAuth }, controller.getUploadUrl);
  app.post("/media/confirm-upload", { preHandler: adminAuth }, controller.confirmUpload);
  app.get("/media/:assetId/transcoding", { preHandler: adminAuth }, controller.transcodingStatus);
  app.get("/media/:assetId/variants", { preHandler: [authenticate] }, controller.variants);
  app.get("/media/content/:contentId/manifest", { preHandler: [authenticate] }, controller.downloadManifest);
}
