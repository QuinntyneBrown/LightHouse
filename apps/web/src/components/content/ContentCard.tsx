"use client";

import React from "react";
import Link from "next/link";
import AgeBadge from "./AgeBadge";
import type { AgeBand } from "@/lib/constants";

interface ContentCardProps {
  id: string;
  title: string;
  type: "video" | "audio";
  duration: string;
  ageBand: AgeBand;
  gradient?: string;
  "data-testid"?: string;
}

export default function ContentCard({
  id,
  title,
  type,
  duration,
  ageBand,
  gradient = "from-accent-blue to-accent-purple",
  "data-testid": testId = "content-card",
}: ContentCardProps) {
  return (
    <Link href={`/play/${id}`} data-testid={testId} className="block">
      <div className="bg-surface-card rounded-xl shadow-sm border border-border-subtle overflow-hidden hover:shadow-md transition-shadow">
        {/* Thumbnail placeholder */}
        <div className={`aspect-video bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <span className="text-4xl text-white/80">{type === "video" ? "🎬" : "🎵"}</span>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-foreground-primary line-clamp-2 mb-1.5" style={{ fontFamily: "var(--font-family-body)" }}>
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-foreground-muted text-xs">
              <span>{type === "video" ? "🎬" : "🎵"}</span>
              <span>{duration}</span>
            </div>
            <AgeBadge ageBand={ageBand} />
          </div>
        </div>
      </div>
    </Link>
  );
}
