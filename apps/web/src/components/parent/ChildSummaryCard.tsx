import React from "react";
import AgeBadge from "@/components/content/AgeBadge";
import type { AgeBand } from "@/lib/constants";

interface ChildSummaryCardProps {
  name: string;
  ageBand: AgeBand;
  avatarIcon: string;
  avatarColor: string;
  watchTimeMinutes: number;
  limitMinutes: number;
}

export default function ChildSummaryCard({ name, ageBand, avatarIcon, avatarColor, watchTimeMinutes, limitMinutes }: ChildSummaryCardProps) {
  const percentUsed = Math.min(100, (watchTimeMinutes / limitMinutes) * 100);
  const isOverLimit = watchTimeMinutes >= limitMinutes;

  return (
    <div data-testid="child-card" className="bg-surface-card rounded-xl border border-border-subtle p-4">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          {avatarIcon}
        </div>
        <div>
          <p className="font-semibold text-foreground-primary">{name}</p>
          <AgeBadge ageBand={ageBand} />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-foreground-secondary">Watch time</span>
          <span className={`font-medium ${isOverLimit ? "text-accent-coral" : "text-foreground-primary"}`}>
            {watchTimeMinutes} / {limitMinutes} min
          </span>
        </div>
        <div className="w-full h-2 bg-border-subtle rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isOverLimit ? "bg-accent-coral" : "bg-accent-green"}`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>
    </div>
  );
}
