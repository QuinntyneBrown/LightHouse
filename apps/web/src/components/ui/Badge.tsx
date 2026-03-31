import React from "react";
import type { AgeBand } from "@/lib/constants";
import { AGE_BANDS } from "@/lib/constants";

interface BadgeProps {
  children?: React.ReactNode;
  variant?: "default" | "seedlings" | "sprouts" | "explorers" | "notification";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-accent-blue-light text-accent-blue",
  seedlings: "bg-blue-100 text-blue-700",
  sprouts: "bg-green-100 text-green-700",
  explorers: "bg-amber-100 text-amber-700",
  notification: "bg-accent-coral text-white min-w-[20px] h-5 text-xs",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function AgeBandBadge({ ageBand }: { ageBand: AgeBand }) {
  const band = AGE_BANDS[ageBand];
  return (
    <Badge variant={ageBand}>
      {band.emoji} {band.label}
    </Badge>
  );
}
