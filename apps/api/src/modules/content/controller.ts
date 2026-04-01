import type { FastifyRequest, FastifyReply } from "fastify";
import type { ContentService } from "./service.js";
import {
  contentCreateSchema,
  contentUpdateSchema,
  contentFilterSchema,
  contentIdParam,
} from "./schema.js";

export class ContentController {
  constructor(private service: ContentService) {}

  list = async (request: FastifyRequest, reply: FastifyReply) => {
    const filter = contentFilterSchema.parse(request.query);
    const result = await this.service.list(filter);
    return reply.send(result);
  };

  get = async (request: FastifyRequest, reply: FastifyReply) => {
    const { contentId } = contentIdParam.parse(request.params);
    const content = await this.service.getById(contentId);
    return reply.send(content);
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = contentCreateSchema.parse(request.body);
    const content = await this.service.create(body, request.user?.sub);
    return reply.status(201).send(content);
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { contentId } = contentIdParam.parse(request.params);
    const body = contentUpdateSchema.parse(request.body);
    const content = await this.service.update(contentId, body);
    return reply.send(content);
  };

  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    const { contentId } = contentIdParam.parse(request.params);
    await this.service.delete(contentId);
    return reply.status(204).send();
  };

  publish = async (request: FastifyRequest, reply: FastifyReply) => {
    const { contentId } = contentIdParam.parse(request.params);
    const content = await this.service.publish(contentId);
    return reply.send(content);
  };

  featured = async (request: FastifyRequest, reply: FastifyReply) => {
    const { ageBand } = request.query as { ageBand?: string };
    const items = await this.service.getFeatured(ageBand);
    return reply.send(items);
  };

  categories = async (_request: FastifyRequest, reply: FastifyReply) => {
    const categories = await this.service.listCategories();
    return reply.send(categories);
  };

  listForChild = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = request.params as { profileId: string };
    const filter = contentFilterSchema.parse(request.query);
    const result = await this.service.listForChild(profileId, filter);
    return reply.send(result);
  };
}
