import type { FastifyRequest, FastifyReply } from "fastify";
import type { AuthService } from "./service.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  consentSchema,
  pinSetupSchema,
  pinVerifySchema,
  pinChangeSchema,
} from "./schema.js";

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = registerSchema.parse(request.body);
    const result = await this.service.register(body, request.ip);
    return reply.status(201).send(result);
  };

  login = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = loginSchema.parse(request.body);
    const result = await this.service.login(body, request.headers["user-agent"], request.ip);
    return reply.send(result);
  };

  refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = refreshTokenSchema.parse(request.body);
    const result = await this.service.refreshToken(body.refreshToken);
    return reply.send(result);
  };

  logout = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = refreshTokenSchema.parse(request.body);
    await this.service.logout(body.refreshToken);
    return reply.status(204).send();
  };

  consent = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = consentSchema.parse(request.body);
    const result = await this.service.recordConsent(request.user.sub, body, request.ip);
    return reply.status(201).send(result);
  };

  setupPin = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = pinSetupSchema.parse(request.body);
    const result = await this.service.setupPin(request.user.sub, body);
    return reply.status(201).send(result);
  };

  verifyPin = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = pinVerifySchema.parse(request.body);
    const result = await this.service.verifyPin(request.user.sub, body.pin);
    return reply.send(result);
  };

  changePin = async (request: FastifyRequest, reply: FastifyReply) => {
    const body = pinChangeSchema.parse(request.body);
    const result = await this.service.changePin(request.user.sub, body);
    return reply.send(result);
  };
}
