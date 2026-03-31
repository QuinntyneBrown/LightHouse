export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  CONSENT: "/consent",
  PIN_SETUP: "/pin-setup",
  HOME: "/home",
  BROWSE: "/browse",
  PLAYLISTS: "/playlists",
  SEARCH: "/search",
  PLAY: "/play",
  PARENT_DASHBOARD: "/dashboard",
  PARENT_SCREEN_TIME: "/screen-time",
  PARENT_HISTORY: "/history",
  PARENT_CONTENT_BLOCKING: "/content-blocking",
  PARENT_PROFILES: "/profiles",
  PARENT_PROFILES_NEW: "/profiles/new",
} as const;

export type AgeBand = "seedlings" | "sprouts" | "explorers";

export const AGE_BANDS: Record<AgeBand, { label: string; emoji: string; ageRange: string; description: string }> = {
  seedlings: { label: "Seedlings", emoji: "🌱", ageRange: "0-2", description: "Soft and gentle content for the littlest ones" },
  sprouts: { label: "Sprouts", emoji: "🌿", ageRange: "3-5", description: "Bright and fun content for curious minds" },
  explorers: { label: "Explorers", emoji: "🧭", ageRange: "6-9", description: "Adventurous content for growing learners" },
};

export const CATEGORIES = [
  { id: "bible-stories", label: "Bible Stories", icon: "📖", color: "#3B82C4" },
  { id: "worship", label: "Worship", icon: "🎵", color: "#F5A623" },
  { id: "prayers", label: "Prayers", icon: "🙏", color: "#9B7ED8" },
  { id: "animated", label: "Animated", icon: "🎬", color: "#FF7E6B" },
  { id: "sing-along", label: "Sing Along", icon: "🎤", color: "#4CAF6E" },
  { id: "bedtime", label: "Bedtime", icon: "🌙", color: "#3B82C4" },
] as const;

export const MOCK_PROFILES = [
  { id: "1", name: "Emma", ageBand: "sprouts" as AgeBand, avatar: { color: "#FF7E6B", icon: "🦋" } },
  { id: "2", name: "Noah", ageBand: "explorers" as AgeBand, avatar: { color: "#3B82C4", icon: "🦁" } },
  { id: "3", name: "Lily", ageBand: "seedlings" as AgeBand, avatar: { color: "#9B7ED8", icon: "🐣" } },
];

export const MOCK_CONTENT = [
  { id: "1", title: "Noah's Ark Adventure", type: "video" as const, duration: "12 min", ageBand: "sprouts" as AgeBand, category: "bible-stories", gradient: "from-accent-blue to-accent-purple" },
  { id: "2", title: "Jesus Loves Me", type: "audio" as const, duration: "3 min", ageBand: "seedlings" as AgeBand, category: "worship", gradient: "from-accent-gold to-accent-coral" },
  { id: "3", title: "David & Goliath", type: "video" as const, duration: "15 min", ageBand: "explorers" as AgeBand, category: "bible-stories", gradient: "from-accent-green to-accent-blue" },
  { id: "4", title: "Bedtime Prayer", type: "audio" as const, duration: "5 min", ageBand: "seedlings" as AgeBand, category: "prayers", gradient: "from-accent-purple to-accent-blue" },
  { id: "5", title: "Creation Song", type: "audio" as const, duration: "4 min", ageBand: "sprouts" as AgeBand, category: "sing-along", gradient: "from-accent-coral to-accent-gold" },
  { id: "6", title: "The Good Samaritan", type: "video" as const, duration: "10 min", ageBand: "explorers" as AgeBand, category: "animated", gradient: "from-accent-blue to-accent-green" },
];

export const MOCK_PLAYLISTS = [
  { id: "1", title: "Morning Worship", icon: "☀️", itemCount: 8, gradient: "from-accent-gold to-accent-coral" },
  { id: "2", title: "Bedtime Stories", icon: "🌙", itemCount: 5, gradient: "from-accent-purple to-accent-blue" },
  { id: "3", title: "Sunday School", icon: "⛪", itemCount: 12, gradient: "from-accent-blue to-accent-green" },
  { id: "4", title: "Sing Along!", icon: "🎤", itemCount: 10, gradient: "from-accent-coral to-accent-gold" },
];
