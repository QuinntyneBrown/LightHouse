import { z } from "zod";

export const contentCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  contentType: z.enum(["VIDEO", "AUDIO", "INTERACTIVE", "READ_ALONG"]),
  durationSeconds: z.number().int().positive().optional(),
  thumbnailUrl: z.string().url().optional(),
  ageBands: z.array(z.enum(["BABY", "TODDLER", "PRESCHOOL", "EARLY_READER"])).min(1),
  categoryIds: z.array(z.string().uuid()).min(1),
  tags: z.array(z.string().min(1).max(50)).optional(),
});

export const contentUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  durationSeconds: z.number().int().positive().optional(),
  thumbnailUrl: z.string().url().optional(),
  isFeatured: z.boolean().optional(),
  ageBands: z.array(z.enum(["BABY", "TODDLER", "PRESCHOOL", "EARLY_READER"])).min(1).optional(),
  categoryIds: z.array(z.string().uuid()).min(1).optional(),
  tags: z.array(z.string().min(1).max(50)).optional(),
});

export const contentFilterSchema = z.object({
  ageBand: z.enum(["BABY", "TODDLER", "PRESCHOOL", "EARLY_READER"]).optional(),
  categoryId: z.string().uuid().optional(),
  contentType: z.enum(["VIDEO", "AUDIO", "INTERACTIVE", "READ_ALONG"]).optional(),
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]).optional(),
  isFeatured: z.coerce.boolean().optional(),
  search: z.string().optional(),
  offset: z.coerce.number().int().min(0).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const contentIdParam = z.object({
  contentId: z.string().uuid(),
});

export const scriptureRefSchema = z.object({
  book: z.string().min(1),
  chapter: z.number().int().positive(),
  verseFrom: z.number().int().positive(),
  verseTo: z.number().int().positive().optional(),
});

export type ContentCreateInput = z.infer<typeof contentCreateSchema>;
export type ContentUpdateInput = z.infer<typeof contentUpdateSchema>;
export type ContentFilterInput = z.infer<typeof contentFilterSchema>;
