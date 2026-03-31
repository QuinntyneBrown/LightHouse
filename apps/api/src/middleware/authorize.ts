import type { FastifyRequest, FastifyReply } from "fastify";
import { ForbiddenError, UnauthorizedError } from "../utils/errors.js";

export function authorize(...allowedRoles: string[]) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const user = request.user;
    if (!user) {
      throw new UnauthorizedError();
    }

    if (allowedRoles.length > 0) {
      const userRole = user.role ?? "PARENT";
      if (!allowedRoles.includes(userRole)) {
        throw new ForbiddenError(`Role '${userRole}' is not authorized for this resource`);
      }
    }
  };
}
