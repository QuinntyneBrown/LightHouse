import type { FastifyRequest, FastifyReply } from "fastify";
import type { ParentalControlsService } from "./service.js";
import {
  screenTimeRulesArraySchema,
  blockContentSchema,
  profileIdParam,
  historyQuerySchema,
} from "./schema.js";

export class ParentalControlsController {
  constructor(private service: ParentalControlsService) {}

  dashboard = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getDashboard(request.user.sub);
    return reply.send(result);
  };

  getScreenTimeRules = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const rules = await this.service.getScreenTimeRules(request.user.sub, profileId);
    return reply.send(rules);
  };

  setScreenTimeRules = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const rules = screenTimeRulesArraySchema.parse(request.body);
    const result = await this.service.setScreenTimeRules(request.user.sub, profileId, rules);
    return reply.send(result);
  };

  getScreenTimeStatus = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const result = await this.service.getScreenTimeStatus(request.user.sub, profileId);
    return reply.send(result);
  };

  blockContent = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const body = blockContentSchema.parse(request.body);
    const result = await this.service.blockContent(request.user.sub, profileId, body);
    return reply.status(201).send(result);
  };

  listBlockedContent = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const result = await this.service.listBlockedContent(request.user.sub, profileId);
    return reply.send(result);
  };

  unblockContent = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const { contentId } = request.params as { contentId: string };
    await this.service.unblockContent(request.user.sub, profileId, contentId);
    return reply.status(204).send();
  };

  viewHistory = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const query = historyQuerySchema.parse(request.query);
    const result = await this.service.getViewHistory(request.user.sub, profileId, query);
    return reply.send(result);
  };
}
