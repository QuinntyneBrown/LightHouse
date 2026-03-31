import type { FastifyRequest, FastifyReply } from "fastify";
import type { ProfileService } from "./service.js";
import { createProfileSchema, updateProfileSchema, profileIdParam } from "./schema.js";

export class ProfileController {
  constructor(private service: ProfileService) {}

  list = async (request: FastifyRequest, reply: FastifyReply) => {
    const profiles = await this.service.listProfiles(request.user.sub);
    return reply.send(profiles);
  };

  create = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = createProfileSchema.parse(request.body);
    const profile = await this.service.createProfile(request.user.sub, body);
    return reply.status(201).send(profile);
  };

  get = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const profile = await this.service.getProfile(request.user.sub, profileId);
    return reply.send(profile);
  };

  update = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const body = updateProfileSchema.parse(request.body);
    const profile = await this.service.updateProfile(request.user.sub, profileId, body);
    return reply.send(profile);
  };

  delete = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    await this.service.deleteProfile(request.user.sub, profileId);
    return reply.status(204).send();
  };

  activate = async (request: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = profileIdParam.parse(request.params);
    const result = await this.service.activateProfile(request.user.sub, profileId);
    return reply.send(result);
  };

  listAvatars = async (_request: FastifyRequest, reply: FastifyReply) => {
    const avatars = await this.service.listAvatars();
    return reply.send(avatars);
  };
}
