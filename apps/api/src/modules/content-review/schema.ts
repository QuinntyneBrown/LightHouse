import { z } from "zod";

export const submitReviewSchema = z.object({
  contentId: z.string().uuid(),
});

export const reviewDecisionSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED", "REVISION_REQUESTED"]),
  notes: z.string().max(2000).optional(),
  theologicalCheck: z.boolean(),
  ageAppropriateness: z.boolean(),
  contentQuality: z.boolean(),
});

export const reviewCommentSchema = z.object({
  body: z.string().min(1).max(2000),
});

export const reviewFilterSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "REVISION_REQUESTED"]).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const reviewIdParam = z.object({
  reviewId: z.string().uuid(),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;
export type ReviewDecisionInput = z.infer<typeof reviewDecisionSchema>;
export type ReviewCommentInput = z.infer<typeof reviewCommentSchema>;
export type ReviewFilterInput = z.infer<typeof reviewFilterSchema>;
