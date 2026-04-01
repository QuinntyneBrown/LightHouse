import type { FastifyRequest, FastifyReply } from "fastify";
import type { PlaybackService } from "./service.js";
import { streamRequestSchema, progressUpdateSchema, historyQuerySchema } from "./schema.js";

export class PlaybackController {
  constructor(private service: PlaybackService) {}

  stream = async (request: FastifyRequest, reply: FastifyReply) => {
    const { contentId, profileId } = streamRequestSchema.parse(request.query);
    const result = await this.service.getStreamUrl(contentId, profileId);
    return reply.send(result);
  };

  saveProgress = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = request.params as { profileId: string };
    const body = progressUpdateSchema.parse(request.body);
    const result = await this.service.saveProgress(profileId, body);
    return reply.send(result);
  };

  getProgress = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId, contentId } = request.params as { profileId: string; contentId: string };
    const result = await this.service.getProgress(profileId, contentId);
    return reply.send(result);
  };

  history = async (request: FastifyRequest, reply: FastifyReply) => {
    const query = historyQuerySchema.parse({
      ...request.query as object,
      profileId: (request.params as { profileId: string }).profileId,
    });
    const result = await this.service.getHistory(query);
    return reply.send(result);
  };
}
