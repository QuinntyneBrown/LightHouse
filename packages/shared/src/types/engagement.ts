export interface BadgeResponse {
  id: string;
  name: string;
  description: string;
  iconUrl: string | null;
  criteria: string;
  earned: boolean;
  earnedAt: string | null;
}

export interface ProgressResponse {
  childProfileId: string;
  metrics: ProgressMetric[];
  currentStreak: number;
  longestStreak: number;
  totalWatchTime: number;
  totalItemsCompleted: number;
}

export interface ProgressMetric {
  metric: string;
  value: number;
  lastUpdated: string;
}

export interface MemoryVerseResponse {
  id: string;
  reference: string;
  text: string;
  ageBand: string;
  completed: boolean;
  completedAt: string | null;
}

export interface MemoryVerseCompleteRequest {
  memoryVerseId: string;
}
