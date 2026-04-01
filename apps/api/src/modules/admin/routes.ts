import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { AdminService } from "./service.js";
import { AdminController } from "./controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

export async function adminRoutes(app: FastifyInstance, prisma: PrismaClient) {
  const service = new AdminService(prisma);
  const controller = new AdminController(service);

  const adminAuth = [authenticate, authorize("SUPER_ADMIN", "CONTENT_ADMIN")];
  const superAdminAuth = [authenticate, authorize("SUPER_ADMIN")];

  // Analytics
  app.get("/admin/analytics", { preHandler: adminAuth }, controller.analyticsOverview);
  app.get("/admin/analytics/content/:contentId", { preHandler: adminAuth }, controller.contentAnalytics);
  app.get("/admin/analytics/usage", { preHandler: adminAuth }, controller.usageMetrics);

  // Church Accounts
  app.get("/admin/churches", { preHandler: adminAuth }, controller.listChurches);
  app.post("/admin/churches", { preHandler: superAdminAuth }, controller.createChurch);
  app.patch("/admin/churches/:churchId/status", { preHandler: superAdminAuth }, controller.updateChurchStatus);

  // Reviewer Management
  app.get("/admin/reviewers", { preHandler: adminAuth }, controller.listReviewers);
  app.post("/admin/reviewers", { preHandler: superAdminAuth }, controller.addReviewer);
  app.delete("/admin/reviewers/:adminId", { preHandler: superAdminAuth }, controller.removeReviewer);

  // System Config
  app.get("/admin/config", { preHandler: superAdminAuth }, controller.getConfig);
  app.put("/admin/config", { preHandler: superAdminAuth }, controller.setConfig);
}
