"use client";

import React from "react";
import type { AgeBand } from "@/lib/constants";

interface QueueItem {
  id: string;
  title: string;
  duration: string;
  type: "video" | "audio";
  gradient?: string;
}

interface PlaylistQueueProps {
  items: QueueItem[];
  currentId?: string;
}

export default function PlaylistQueue({ items, currentId }: PlaylistQueueProps) {
  return (
    <div data-testid="playlist-queue" className="px-4">
      <h3 className="text-lg mb-3 text-foreground-primary">Up Next</h3>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            data-testid="queue-item"
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              item.id === currentId ? "bg-accent-blue-light" : "bg-surface-card hover:bg-surface-secondary"
            }`}
          >
            {/* Mini thumbnail */}
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.gradient || "from-accent-blue to-accent-purple"} flex items-center justify-center flex-shrink-0`}>
              <span className="text-lg text-white/80">{item.type === "video" ? "🎬" : "🎵"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground-primary truncate">{item.title}</p>
              <p className="text-xs text-foreground-muted">{item.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
