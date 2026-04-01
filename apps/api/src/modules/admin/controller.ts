import type { FastifyRequest, FastifyReply } from "fastify";
import type { AdminService } from "./service.js";
import {
  analyticsQuerySchema,
  churchAccountCreateSchema,
  churchAccountUpdateStatusSchema,
  reviewerManageSchema,
  systemConfigSchema,
  contentIdParam,
  churchIdParam,
  adminIdParam,
} from "./schema.js";

export class AdminController {
  constructor(private service: AdminService) {}

  analyticsOverview = async (_request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getAnalyticsOverview();
    return reply.send(result);
  };

  contentAnalytics = async (request: FastifyRequest, reply: FastifyReply) => {
    const { contentId } = contentIdParam.parse(request.params);
    const result = await this.service.getContentAnalytics(contentId);
    return reply.send(result);
  };

  usageMetrics = async (request: FastifyRequest, reply: FastifyReply) => {
    const { from, to } = analyticsQuerySchema.parse(request.query);
    const result = await this.service.getUsageMetrics(from, to);
    return reply.send(result);
  };

  listChurches = async (_request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.listChurchAccounts();
    return reply.send(result);
  };

  createChurch = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = churchAccountCreateSchema.parse(request.body);
    const result = await this.service.createChurchAccount(body);
    return reply.status(201).send(result);
  };

  updateChurchStatus = async (request: FastifyRequest, reply: FastifyReply) => {
    const { churchId } = churchIdParam.parse(request.params);
    const { status } = churchAccountUpdateStatusSchema.parse(request.body);
    const result = await this.service.updateChurchStatus(churchId, status);
    return reply.send(result);
  };

  listReviewers = async (_request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.listReviewers();
    return reply.send(result);
  };

  addReviewer = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = reviewerManageSchema.parse(request.body);
    const result = await this.service.addReviewer(body);
    return reply.status(201).send(result);
  };

  removeReviewer = async (request: FastifyRequest, reply: FastifyReply) => {
    const { adminId } = adminIdParam.parse(request.params);
    await this.service.removeReviewer(adminId);
    return reply.status(204).send();
  };

  getConfig = async (_request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getSystemConfig();
    return reply.send(result);
  };

  setConfig = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = systemConfigSchema.parse(request.body);
    const result = await this.service.setSystemConfig(body);
    return reply.send(result);
  };
}
