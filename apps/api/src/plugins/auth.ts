import type { FastifyInstance } from "fastify";
import fjwt from "@fastify/jwt";

export interface JwtPayload {
  sub: string; // account id
  email: string;
  displayName: string;
  role?: string;
  iat?: number;
  exp?: number;
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

export async function registerJwt(app: FastifyInstance, secret: string) {
  await app.register(fjwt, {
    secret,
    sign: {
      algorithm: "HS256",
    },
  });
}
