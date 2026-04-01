import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { ParentalControlsService } from "./service.js";
import { ParentalControlsController } from "./controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validatePin } from "../../middleware/validate-pin.js";

export async function parentalControlsRoutes(app: FastifyInstance, prisma: PrismaClient) {
  const service = new ParentalControlsService(prisma);
  const controller = new ParentalControlsController(service);

  const parentAuth = [authenticate, validatePin(prisma)];

  app.get("/parental/dashboard", { preHandler: [authenticate] }, controller.dashboard);
  app.get("/parental/:profileId/screen-time", { preHandler: parentAuth }, controller.getScreenTimeRules);
  app.put("/parental/:profileId/screen-time", { preHandler: parentAuth }, controller.setScreenTimeRules);
  app.get("/parental/:profileId/screen-time/status", { preHandler: [authenticate] }, controller.getScreenTimeStatus);
  app.post("/parental/:profileId/blocked", { preHandler: parentAuth }, controller.blockContent);
  app.get("/parental/:profileId/blocked", { preHandler: parentAuth }, controller.listBlockedContent);
  app.delete("/parental/:profileId/blocked/:contentId", { preHandler: parentAuth }, controller.unblockContent);
  app.get("/parental/:profileId/history", { preHandler: [authenticate] }, controller.viewHistory);
}
