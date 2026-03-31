import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const consentSchema = z.object({
  consentType: z.enum(["coppa", "terms", "privacy"]),
  version: z.string().min(1),
  granted: z.boolean(),
});

export const pinSetupSchema = z.object({
  pin: z.string().length(4).regex(/^\d{4}$/, "PIN must be 4 digits"),
});

export const pinVerifySchema = z.object({
  pin: z.string().length(4).regex(/^\d{4}$/),
});

export const pinChangeSchema = z.object({
  currentPin: z.string().length(4).regex(/^\d{4}$/),
  newPin: z.string().length(4).regex(/^\d{4}$/),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ConsentInput = z.infer<typeof consentSchema>;
export type PinSetupInput = z.infer<typeof pinSetupSchema>;
export type PinVerifyInput = z.infer<typeof pinVerifySchema>;
export type PinChangeInput = z.infer<typeof pinChangeSchema>;
