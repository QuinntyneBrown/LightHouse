import type { FastifyRequest, FastifyReply } from "fastify";
import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { UnauthorizedError, ForbiddenError } from "../utils/errors.js";

export function validatePin(prisma: PrismaClient) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const user = request.user;
    if (!user) {
      throw new UnauthorizedError();
    }

    const pinHeader = request.headers["x-pin-token"] as string | undefined;
    if (!pinHeader) {
      throw new ForbiddenError("PIN verification required. Send PIN in X-Pin-Token header.");
    }

    const pin = await prisma.pIN.findUnique({
      where: { accountId: user.sub },
    });

    if (!pin) {
      throw new ForbiddenError("PIN not set up. Please set up a PIN first.");
    }

    const isValid = await bcrypt.compare(pinHeader, pin.hash);
    if (!isValid) {
      throw new ForbiddenError("Invalid PIN");
    }
  };
}
