import { z } from "zod";

export const screenTimeRuleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  dailyLimitMinutes: z.number().int().min(0).max(1440),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
});

export const screenTimeRulesArraySchema = z.array(screenTimeRuleSchema);

export const blockContentSchema = z.object({
  contentId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

export const profileIdParam = z.object({
  profileId: z.string().uuid(),
});

export const historyQuerySchema = z.object({
  offset: z.coerce.number().int().min(0).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type ScreenTimeRuleInput = z.infer<typeof screenTimeRuleSchema>;
export type BlockContentInput = z.infer<typeof blockContentSchema>;
