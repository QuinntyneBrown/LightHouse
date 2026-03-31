import type { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  ForbiddenError,
} from "../../utils/errors.js";
import type {
  RegisterInput,
  LoginInput,
  ConsentInput,
  PinSetupInput,
  PinChangeInput,
} from "./schema.js";

const PIN_SALT_ROUNDS = 10;

export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private app: FastifyInstance
  ) {}

  async register(input: RegisterInput, ipAddress?: string) {
    const existing = await this.prisma.account.findUnique({
      where: { email: input.email },
    });
    if (existing) {
      throw new ConflictError("An account with this email already exists");
    }

    const account = await this.prisma.account.create({
      data: {
        email: input.email,
        displayName: input.displayName,
      },
    });

    // Record COPPA consent automatically on registration
    await this.prisma.consentRecord.create({
      data: {
        accountId: account.id,
        consentType: "coppa",
        version: "1.0",
        ipAddress,
      },
    });

    const tokens = await this.generateTokens(account);
    return tokens;
  }

  async login(input: LoginInput, userAgent?: string, ipAddress?: string) {
    // In production this would verify against Keycloak
    // For development, we check if the account exists by email
    const account = await this.prisma.account.findUnique({
      where: { email: input.email },
    });

    if (!account) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const tokens = await this.generateTokens(account);

    // Create session
    await this.prisma.session.create({
      data: {
        accountId: account.id,
        refreshToken: tokens.refreshToken,
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  }

  async refreshToken(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      include: { account: true },
    });

    if (!session) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    if (session.expiresAt < new Date()) {
      await this.prisma.session.delete({ where: { id: session.id } });
      throw new UnauthorizedError("Refresh token expired");
    }

    // Rotate refresh token
    const newTokens = await this.generateTokens(session.account);

    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newTokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return newTokens;
  }

  async logout(refreshToken: string) {
    await this.prisma.session.deleteMany({
      where: { refreshToken },
    });
  }

  async recordConsent(accountId: string, input: ConsentInput, ipAddress?: string) {
    const consent = await this.prisma.consentRecord.create({
      data: {
        accountId,
        consentType: input.consentType,
        version: input.version,
        ipAddress,
      },
    });
    return consent;
  }

  async setupPin(accountId: string, input: PinSetupInput) {
    const existing = await this.prisma.pIN.findUnique({
      where: { accountId },
    });

    if (existing) {
      throw new ConflictError("PIN already set up. Use change PIN endpoint instead.");
    }

    const hash = await bcrypt.hash(input.pin, PIN_SALT_ROUNDS);
    await this.prisma.pIN.create({
      data: {
        accountId,
        hash,
      },
    });

    return { success: true };
  }

  async verifyPin(accountId: string, pin: string) {
    const pinRecord = await this.prisma.pIN.findUnique({
      where: { accountId },
    });

    if (!pinRecord) {
      throw new NotFoundError("PIN not set up");
    }

    const isValid = await bcrypt.compare(pin, pinRecord.hash);
    if (!isValid) {
      throw new ForbiddenError("Invalid PIN");
    }

    return { valid: true };
  }

  async changePin(accountId: string, input: PinChangeInput) {
    const pinRecord = await this.prisma.pIN.findUnique({
      where: { accountId },
    });

    if (!pinRecord) {
      throw new NotFoundError("PIN not set up");
    }

    const isValid = await bcrypt.compare(input.currentPin, pinRecord.hash);
    if (!isValid) {
      throw new ForbiddenError("Current PIN is incorrect");
    }

    const hash = await bcrypt.hash(input.newPin, PIN_SALT_ROUNDS);
    await this.prisma.pIN.update({
      where: { accountId },
      data: { hash },
    });

    return { success: true };
  }

  private async generateTokens(account: { id: string; email: string; displayName: string }) {
    const accessToken = this.app.jwt.sign(
      {
        sub: account.id,
        email: account.email,
        displayName: account.displayName,
      },
      { expiresIn: "15m" }
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      tokenType: "Bearer" as const,
    };
  }
}
