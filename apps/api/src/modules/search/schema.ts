import { z } from "zod";

export const searchQuerySchema = z.object({
  query: z.string().min(1).max(200),
  ageBand: z.enum(["BABY", "TODDLER", "PRESCHOOL", "EARLY_READER"]).optional(),
  categoryId: z.string().uuid().optional(),
  contentType: z.enum(["VIDEO", "AUDIO", "INTERACTIVE", "READ_ALONG"]).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
