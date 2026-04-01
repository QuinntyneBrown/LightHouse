import { z } from "zod";

export const profileIdParam = z.object({
  profileId: z.string().uuid(),
});

export const verseCompleteSchema = z.object({
  memoryVerseId: z.string().uuid(),
});

export const progressUpdateSchema = z.object({
  metric: z.string().min(1).max(50),
  value: z.number().int().min(0),
});

export type VerseCompleteInput = z.infer<typeof verseCompleteSchema>;
export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;
