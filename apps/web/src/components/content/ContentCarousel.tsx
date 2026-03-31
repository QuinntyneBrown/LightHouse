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

interface ContentCarouselProps {
  items: ContentItem[];
  title?: string;
}

export default function ContentCarousel({ items, title }: ContentCarouselProps) {
  return (
    <section data-testid="featured-carousel">
      {title && (
        <h2 className="text-xl px-4 mb-3 text-foreground-primary">{title}</h2>
      )}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 pb-2">
        {items.map((item) => (
          <div key={item.id} className="min-w-[200px] max-w-[200px] flex-shrink-0">
            <ContentCard {...item} data-testid="featured-card" />
          </div>
        ))}
      </div>
    </section>
  );
}
