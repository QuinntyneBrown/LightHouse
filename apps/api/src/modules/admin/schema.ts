import { z } from "zod";

export const analyticsQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const churchAccountCreateSchema = z.object({
  name: z.string().min(1).max(200),
  website: z.string().url().optional(),
  contactEmail: z.string().email(),
});

export const churchAccountUpdateStatusSchema = z.object({
  status: z.enum(["APPROVED", "SUSPENDED", "REJECTED"]),
});

export const reviewerManageSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
  role: z.enum(["REVIEWER", "CONTENT_ADMIN"]),
});

export const systemConfigSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.string(),
});

export const contentIdParam = z.object({
  contentId: z.string().uuid(),
});

export const churchIdParam = z.object({
  churchId: z.string().uuid(),
});

export const adminIdParam = z.object({
  adminId: z.string().uuid(),
});

export type ChurchAccountCreateInput = z.infer<typeof churchAccountCreateSchema>;
export type ReviewerManageInput = z.infer<typeof reviewerManageSchema>;
export type SystemConfigInput = z.infer<typeof systemConfigSchema>;
