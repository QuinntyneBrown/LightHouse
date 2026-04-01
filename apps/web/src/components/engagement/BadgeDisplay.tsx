import React from "react";

interface BadgeItem {
  id: string;
  icon: string;
  label: string;
  earned: boolean;
}

const MOCK_BADGES: BadgeItem[] = [
  { id: "1", icon: "⭐", label: "First Watch", earned: true },
  { id: "2", icon: "📖", label: "Bible Reader", earned: true },
  { id: "3", icon: "🎵", label: "Song Singer", earned: true },
  { id: "4", icon: "🙏", label: "Prayer Warrior", earned: false },
  { id: "5", icon: "🌟", label: "7-Day Streak", earned: false },
  { id: "6", icon: "❤️", label: "Kind Heart", earned: false },
];

export default function BadgeDisplay() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {MOCK_BADGES.map((badge) => (
        <div
          key={badge.id}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl ${
            badge.earned ? "bg-accent-gold-light" : "bg-surface-secondary opacity-50"
          }`}
        >
          <span className="text-2xl">{badge.icon}</span>
          <span className="text-[10px] font-medium text-foreground-secondary text-center">{badge.label}</span>
          {!badge.earned && <span className="text-[10px] text-foreground-muted">🔒</span>}
        </div>
      ))}
    </div>
  );
}
