export interface ScreenTimeConfig {
  childProfileId: string;
  dayOfWeek: number;
  dailyLimitMinutes: number;
  startTime?: string;
  endTime?: string;
}

export interface ScreenTimeStatusResponse {
  childProfileId: string;
  dailyLimitMinutes: number;
  usedMinutes: number;
  remainingMinutes: number;
  isAllowed: boolean;
  activeSession: boolean;
}

export interface DashboardResponse {
  childProfiles: DashboardChildSummary[];
  totalWatchTimeToday: number;
  recentActivity: ViewHistoryItem[];
}

export interface DashboardChildSummary {
  profileId: string;
  name: string;
  ageBand: string;
  watchTimeToday: number;
  screenTimeRemaining: number;
  lastActive: string | null;
}

export interface ViewHistoryItem {
  id: string;
  childProfileId: string;
  childName: string;
  contentId: string;
  contentTitle: string;
  contentType: string;
  thumbnailUrl: string | null;
  watchedAt: string;
  durationSeconds: number;
}

export interface BlockedContentRequest {
  contentId: string;
  reason?: string;
}

export interface BlockedContentResponse {
  id: string;
  contentId: string;
  contentTitle: string;
  reason: string | null;
  createdAt: string;
}
