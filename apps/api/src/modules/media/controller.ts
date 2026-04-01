import type { FastifyRequest, FastifyReply } from "fastify";
import type { MediaService } from "./service.js";
import {
  uploadUrlRequestSchema,
  uploadConfirmSchema,
  mediaAssetIdParam,
  contentIdParam,
} from "./schema.js";

export class MediaController {
  constructor(private service: MediaService) {}

  getUploadUrl = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = uploadUrlRequestSchema.parse(request.body);
    const result = await this.service.getUploadUrl(body);
    return reply.send(result);
  };

  confirmUpload = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = uploadConfirmSchema.parse(request.body);
    const result = await this.service.confirmUpload(body);
    return reply.status(201).send(result);
  };

  transcodingStatus = async (request: FastifyRequest, reply: FastifyReply) => {
    const { assetId } = mediaAssetIdParam.parse(request.params);
    const result = await this.service.getTranscodingStatus(assetId);
    return reply.send(result);
  };

  variants = async (request: FastifyRequest, reply: FastifyReply) => {
    const { assetId } = mediaAssetIdParam.parse(request.params);
    const result = await this.service.listVariants(assetId);
    return reply.send(result);
  };

  downloadManifest = async (request: FastifyRequest, reply: FastifyReply) => {
    const { contentId } = contentIdParam.parse(request.params);
    const result = await this.service.getDownloadManifest(contentId);
    return reply.send(result);
  };
}
