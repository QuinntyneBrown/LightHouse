import React from "react";
import AgeBadge from "@/components/content/AgeBadge";
import type { AgeBand } from "@/lib/constants";

interface ProfileCardProps {
  name: string;
  ageBand: AgeBand;
  avatarIcon: string;
  avatarColor: string;
}

export default function ProfileCard({ name, ageBand, avatarIcon, avatarColor }: ProfileCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-surface-card rounded-xl border border-border-subtle">
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
  );
}
