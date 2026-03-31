"use client";

import React from "react";
import ContentCard from "./ContentCard";
import type { AgeBand } from "@/lib/constants";

interface ContentItem {
  id: string;
  title: string;
  type: "video" | "audio";
  duration: string;
  ageBand: AgeBand;
  gradient?: string;
}

interface ContentGridProps {
  items: ContentItem[];
}

export default function ContentGrid({ items }: ContentGridProps) {
  return (
    <div data-testid="content-grid" className="grid grid-cols-2 gap-3 px-4">
      {items.map((item) => (
        <ContentCard key={item.id} {...item} />
      ))}
    </div>
  );
}
