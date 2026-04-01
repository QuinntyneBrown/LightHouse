import { z } from "zod";

export const uploadUrlRequestSchema = z.object({
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  contentId: z.string().uuid(),
});

export const uploadConfirmSchema = z.object({
  key: z.string().min(1),
  contentId: z.string().uuid(),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive(),
});

export const mediaAssetIdParam = z.object({
  assetId: z.string().uuid(),
});

export const contentIdParam = z.object({
  contentId: z.string().uuid(),
});

export type UploadUrlRequestInput = z.infer<typeof uploadUrlRequestSchema>;
export type UploadConfirmInput = z.infer<typeof uploadConfirmSchema>;
