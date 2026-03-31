import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { ProfileService } from "./service.js";
import { ProfileController } from "./controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function profileRoutes(app: FastifyInstance, prisma: PrismaClient) {
  const service = new ProfileService(prisma);
  const controller = new ProfileController(service);

  app.get("/profiles", { preHandler: [authenticate] }, controller.list);
  app.post("/profiles", { preHandler: [authenticate] }, controller.create);
  app.get("/profiles/:profileId", { preHandler: [authenticate] }, controller.get);
  app.put("/profiles/:profileId", { preHandler: [authenticate] }, controller.update);
  app.delete("/profiles/:profileId", { preHandler: [authenticate] }, controller.delete);
  app.post("/profiles/:profileId/activate", { preHandler: [authenticate] }, controller.activate);
  app.get("/avatars", controller.listAvatars);
}
