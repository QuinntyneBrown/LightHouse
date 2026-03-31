import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { AuthService } from "./service.js";
import { AuthController } from "./controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function authRoutes(app: FastifyInstance, prisma: PrismaClient) {
  const service = new AuthService(prisma, app);
  const controller = new AuthController(service);

  app.post("/auth/register", controller.register);
  app.post("/auth/login", controller.login);
  app.post("/auth/refresh", controller.refresh);
  app.post("/auth/logout", controller.logout);

  // Protected routes
  app.post("/auth/consent", { preHandler: [authenticate] }, controller.consent);
  app.post("/auth/pin/setup", { preHandler: [authenticate] }, controller.setupPin);
  app.post("/auth/pin/verify", { preHandler: [authenticate] }, controller.verifyPin);
  app.post("/auth/pin/change", { preHandler: [authenticate] }, controller.changePin);
}
