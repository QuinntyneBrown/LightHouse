import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import type { AppConfig } from "../../config.js";
import { SearchService } from "./service.js";
import { SearchController } from "./controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

export async function searchRoutes(app: FastifyInstance, prisma: PrismaClient, config: AppConfig) {
  const service = new SearchService(prisma, config.meilisearchUrl, config.meilisearchApiKey);
  const controller = new SearchController(service);

  app.get("/search", controller.search);
  app.get("/search/suggestions", controller.suggestions);
  app.post("/search/reindex", {
    preHandler: [authenticate, authorize("SUPER_ADMIN", "CONTENT_ADMIN")],
  }, controller.reindex);
}
