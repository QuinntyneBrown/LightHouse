import { z } from "zod";

export const createProfileSchema = z.object({
  name: z.string().min(1).max(50),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  ageBand: z.enum(["BABY", "TODDLER", "PRESCHOOL", "EARLY_READER"]),
  avatarId: z.string().uuid().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  ageBand: z.enum(["BABY", "TODDLER", "PRESCHOOL", "EARLY_READER"]).optional(),
  avatarId: z.string().uuid().optional(),
});

export const profileIdParam = z.object({
  profileId: z.string().uuid(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
