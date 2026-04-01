import { z } from "zod";

export const streamRequestSchema = z.object({
  contentId: z.string().uuid(),
  profileId: z.string().uuid(),
});

export const progressUpdateSchema = z.object({
  contentId: z.string().uuid(),
  progressSeconds: z.number().int().min(0),
  completed: z.boolean(),
});

export const historyQuerySchema = z.object({
  profileId: z.string().uuid(),
  offset: z.coerce.number().int().min(0).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type StreamRequestInput = z.infer<typeof streamRequestSchema>;
export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;
export type HistoryQueryInput = z.infer<typeof historyQuerySchema>;
