import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { ZodError } from "zod";
import { loadConfig } from "./config.js";
import { getLoggerConfig } from "./utils/logger.js";
import { AppError, ScreenTimeLimitError } from "./utils/errors.js";
import { registerCors } from "./plugins/cors.js";
import { registerJwt } from "./plugins/auth.js";
import { registerSwagger } from "./plugins/swagger.js";
import { authRoutes } from "./modules/auth/routes.js";
import { profileRoutes } from "./modules/profiles/routes.js";
import { contentRoutes } from "./modules/content/routes.js";
import { contentReviewRoutes } from "./modules/content-review/routes.js";
import { playbackRoutes } from "./modules/playback/routes.js";
import { parentalControlsRoutes } from "./modules/parental-controls/routes.js";
import { engagementRoutes } from "./modules/engagement/routes.js";
import { searchRoutes } from "./modules/search/routes.js";
import { mediaRoutes } from "./modules/media/routes.js";
import { adminRoutes } from "./modules/admin/routes.js";

async function main() {
  const config = loadConfig();

  const app = Fastify({
    logger: getLoggerConfig(config.nodeEnv) as any,
  });

  const prisma = new PrismaClient();

  // ── Global error handler ──────────────────────────────────────────────
  app.setErrorHandler((error, request, reply) => {
    // Zod validation errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.issues,
      });
    }

    // Custom app errors
    if (error instanceof AppError) {
      const payload: any = {
        statusCode: error.statusCode,
        code: error.code,
        message: error.message,
      };

      if (error instanceof ScreenTimeLimitError) {
        payload.remainingMinutes = error.remainingMinutes;
      }

      return reply.status(error.statusCode).send(payload);
    }

    // Fastify JWT errors
    const fastifyError = error as { statusCode?: number; message?: string };
    if (fastifyError.statusCode === 401) {
      return reply.status(401).send({
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: fastifyError.message ?? "Unauthorized",
      });
    }

    // Unknown errors
    request.log.error(error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return reply.status(500).send({
      statusCode: 500,
      code: "INTERNAL_ERROR",
      message: config.nodeEnv === "production" ? "Internal server error" : errMsg,
    });
  });

  // ── Plugins ───────────────────────────────────────────────────────────
  await registerCors(app, config.corsOrigin);
  await registerJwt(app, config.jwtSecret);
  await registerSwagger(app);

  // ── Health check ──────────────────────────────────────────────────────
  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  // ── Register module routes ────────────────────────────────────────────
  await authRoutes(app, prisma);
  await profileRoutes(app, prisma);
  await contentRoutes(app, prisma, config);
  await contentReviewRoutes(app, prisma);
  await playbackRoutes(app, prisma, config);
  await parentalControlsRoutes(app, prisma);
  await engagementRoutes(app, prisma);
  await searchRoutes(app, prisma, config);
  await mediaRoutes(app, prisma, config);
  await adminRoutes(app, prisma);

  // ── Swagger ready ─────────────────────────────────────────────────────
  await app.ready();

  // ── Graceful shutdown ─────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}. Shutting down gracefully...`);
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // ── Start server ──────────────────────────────────────────────────────
  try {
    await app.listen({ port: config.port, host: config.host });
    app.log.info(`LightHouse Kids API running on http://${config.host}:${config.port}`);
    app.log.info(`Swagger docs: http://localhost:${config.port}/docs`);
  } catch (err) {
    app.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
