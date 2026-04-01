import type { FastifyRequest, FastifyReply } from "fastify";
import type { EngagementService } from "./service.js";
import { profileIdParam, verseCompleteSchema, progressUpdateSchema } from "./schema.js";

export class EngagementController {
  constructor(private service: EngagementService) {}

  badges = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const badges = await this.service.getBadges(profileId);
    return reply.send(badges);
  };

  progress = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const progress = await this.service.getProgress(profileId);
    return reply.send(progress);
  };

  updateProgress = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const body = progressUpdateSchema.parse(request.body);
    const result = await this.service.updateProgress(profileId, body.metric, body.value);
    return reply.send(result);
  };

  streak = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const result = await this.service.recordStreak(profileId);
    return reply.send(result);
  };

  memoryVerseOfDay = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const verse = await this.service.getMemoryVerseOfDay(profileId);
    return reply.send(verse);
  };

  completeVerse = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const body = verseCompleteSchema.parse(request.body);
    const result = await this.service.completeVerse(profileId, body.memoryVerseId);
    return reply.status(201).send(result);
  };
}
