export interface AnalyticsOverview {
  totalAccounts: number;
  totalChildProfiles: number;
  totalContent: number;
  totalPlaybackSessions: number;
  totalWatchTimeMinutes: number;
  activeUsersToday: number;
  contentByStatus: Record<string, number>;
  contentByType: Record<string, number>;
  topContent: TopContentItem[];
}

export interface TopContentItem {
  contentId: string;
  title: string;
  playCount: number;
  totalWatchTimeMinutes: number;
}

export interface ContentAnalytics {
  contentId: string;
  title: string;
  playCount: number;
  uniqueViewers: number;
  totalWatchTimeMinutes: number;
  averageWatchTimeMinutes: number;
  completionRate: number;
}

export interface UsageMetrics {
  period: string;
  dailyActiveUsers: number[];
  dailyPlaybackSessions: number[];
  dailyWatchTimeMinutes: number[];
  dates: string[];
}

export interface ChurchAccountResponse {
  id: string;
  name: string;
  website: string | null;
  contactEmail: string;
  status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  adminCount: number;
}

export interface ChurchAccountCreateRequest {
  name: string;
  website?: string;
  contactEmail: string;
}

export interface ReviewerManageRequest {
  email: string;
  displayName: string;
  role: "REVIEWER" | "CONTENT_ADMIN";
}

export interface SystemConfigItem {
  key: string;
  value: string;
}
