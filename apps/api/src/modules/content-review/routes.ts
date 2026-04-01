import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { ContentReviewService } from "./service.js";
import { ContentReviewController } from "./controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

export async function contentReviewRoutes(app: FastifyInstance, prisma: PrismaClient) {
  const service = new ContentReviewService(prisma);
  const controller = new ContentReviewController(service);

  const reviewerAuth = [authenticate, authorize("SUPER_ADMIN", "CONTENT_ADMIN", "REVIEWER")];

  app.post("/reviews", { preHandler: [authenticate, authorize("SUPER_ADMIN", "CONTENT_ADMIN")] }, controller.submit);
  app.get("/reviews", { preHandler: reviewerAuth }, controller.listPending);
  app.get("/reviews/:reviewId", { preHandler: reviewerAuth }, controller.get);
  app.post("/reviews/:reviewId/decision", { preHandler: reviewerAuth }, controller.decide);
  app.post("/reviews/:reviewId/comments", { preHandler: reviewerAuth }, controller.comment);
}
