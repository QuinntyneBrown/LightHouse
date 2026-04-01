import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import type { AppConfig } from "../../config.js";
import { ContentService } from "./service.js";
import { ContentController } from "./controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

export async function contentRoutes(app: FastifyInstance, prisma: PrismaClient, config: AppConfig) {
  const service = new ContentService(prisma, config.meilisearchUrl, config.meilisearchApiKey);
  const controller = new ContentController(service);

  // Public
  app.get("/content", controller.list);
  app.get("/content/featured", controller.featured);
  app.get("/content/categories", controller.categories);
  app.get("/content/:contentId", controller.get);

  // Authenticated - child-filtered content
  app.get("/content/child/:profileId", { preHandler: [authenticate] }, controller.listForChild);

  // Admin
  app.post("/content", { preHandler: [authenticate, authorize("SUPER_ADMIN", "CONTENT_ADMIN")] }, controller.create);
  app.put("/content/:contentId", { preHandler: [authenticate, authorize("SUPER_ADMIN", "CONTENT_ADMIN")] }, controller.update);
  app.delete("/content/:contentId", { preHandler: [authenticate, authorize("SUPER_ADMIN", "CONTENT_ADMIN")] }, controller.delete);
  app.post("/content/:contentId/publish", { preHandler: [authenticate, authorize("SUPER_ADMIN", "CONTENT_ADMIN")] }, controller.publish);
}
