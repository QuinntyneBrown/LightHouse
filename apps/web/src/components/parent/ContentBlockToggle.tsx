"use client";

import React from "react";

interface ContentBlockToggleProps {
  title: string;
  type: "video" | "audio";
  blocked: boolean;
  onToggle: () => void;
}

export default function ContentBlockToggle({ title, type, blocked, onToggle }: ContentBlockToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-surface-card rounded-xl border border-border-subtle">
      <div className="flex items-center gap-3">
        <span className="text-lg">{type === "video" ? "🎬" : "🎵"}</span>
        <span className="text-sm font-medium text-foreground-primary">{title}</span>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors ${blocked ? "bg-accent-coral" : "bg-accent-green"}`}
      >
        <span
          className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${blocked ? "left-5.5" : "left-0.5"}`}
          style={{ transform: blocked ? "translateX(0)" : "translateX(0)" , left: blocked ? "22px" : "2px" }}
        />
      </button>
    </div>
  );
}
