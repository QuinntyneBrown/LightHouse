import type { FastifyRequest, FastifyReply } from "fastify";
import type { SearchService } from "./service.js";
import { searchQuerySchema } from "./schema.js";

export class SearchController {
  constructor(private service: SearchService) {}

  search = async (request: FastifyRequest, reply: FastifyReply) => {
    const query = searchQuerySchema.parse(request.query);
    const result = await this.service.search(query);
    return reply.send(result);
  };

  suggestions = async (request: FastifyRequest, reply: FastifyReply) => {
    const { q } = request.query as { q?: string };
    if (!q || q.length < 1) {
      return reply.send([]);
    }
    const suggestions = await this.service.suggestions(q);
    return reply.send(suggestions);
  };

  reindex = async (_request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.reindex();
    return reply.send(result);
  };
}
