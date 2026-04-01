import React from "react";

interface HistoryItem {
  id: string;
  title: string;
  type: "video" | "audio";
  date: string;
  duration: string;
}

interface ViewHistoryListProps {
  items: HistoryItem[];
}

export default function ViewHistoryList({ items }: ViewHistoryListProps) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          data-testid="activity-item"
          className="flex items-center gap-3 p-3 bg-surface-card rounded-xl border border-border-subtle"
        >
          <span className="text-lg">{item.type === "video" ? "🎬" : "🎵"}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground-primary truncate">{item.title}</p>
            <p className="text-xs text-foreground-muted">{item.date}</p>
          </div>
          <span className="text-xs text-foreground-muted flex-shrink-0">{item.duration}</span>
        </div>
      ))}
    </div>
  );
}
