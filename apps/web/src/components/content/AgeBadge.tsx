import React from "react";
import type { AgeBand } from "@/lib/constants";
import { AGE_BANDS } from "@/lib/constants";

const badgeColors: Record<AgeBand, string> = {
  seedlings: "bg-blue-100 text-blue-700",
  sprouts: "bg-green-100 text-green-700",
  explorers: "bg-amber-100 text-amber-700",
};

export default function AgeBadge({ ageBand }: { ageBand: AgeBand }) {
  const band = AGE_BANDS[ageBand];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeColors[ageBand]}`}>
      {band.emoji} {band.label}
    </span>
  );
}
