export interface StreamResponse {
  url: string;
  expiresIn: number;
  contentId: string;
  contentType: string;
  variants: StreamVariant[];
}

export interface StreamVariant {
  url: string;
  format: string;
  resolution: string | null;
  bitrateKbps: number | null;
}

export interface ProgressUpdate {
  contentId: string;
  progressSeconds: number;
  completed: boolean;
}

export interface PlaybackHistoryItem {
  id: string;
  contentId: string;
  contentTitle: string;
  contentType: string;
  thumbnailUrl: string | null;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number;
}

export interface WatchProgressResponse {
  contentId: string;
  progressSeconds: number;
  completed: boolean;
  updatedAt: string;
}
