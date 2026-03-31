export interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

export interface UploadConfirmRequest {
  key: string;
  contentId: string;
  mimeType: string;
  sizeBytes: number;
}

export interface TranscodingStatusResponse {
  jobId: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress: number;
  targetFormat: string;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

export interface MediaVariantResponse {
  id: string;
  format: string;
  resolution: string | null;
  bitrateKbps: number | null;
  sizeBytes: number;
}

export interface DownloadManifestResponse {
  contentId: string;
  originalKey: string;
  variants: MediaVariantDownload[];
}

export interface MediaVariantDownload {
  format: string;
  resolution: string | null;
  downloadUrl: string;
  sizeBytes: number;
}
