"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ContentGrid from "@/components/content/ContentGrid";
import { MOCK_CONTENT, CATEGORIES, AGE_BANDS } from "@/lib/constants";
import type { AgeBand } from "@/lib/constants";

const ageBandKeys: AgeBand[] = ["seedlings", "sprouts", "explorers"];

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const [activeFilter, setActiveFilter] = useState<AgeBand | "all">("all");

  const category = CATEGORIES.find((c) => c.id === categoryId);
  const filtered = MOCK_CONTENT.filter((item) => {
    const matchesCategory = item.category === categoryId;
    const matchesAge = activeFilter === "all" || item.ageBand === activeFilter;
    return matchesCategory && matchesAge;
  });

  // Show all content if no category match (for demo)
  const displayItems = filtered.length > 0 ? filtered : MOCK_CONTENT.filter((item) => activeFilter === "all" || item.ageBand === activeFilter);

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-4 flex items-center gap-3">
        <Link href="/browse" data-testid="back-button" className="w-10 h-10 rounded-full bg-surface-card border border-border-subtle flex items-center justify-center text-foreground-secondary hover:bg-surface-secondary">
          ←
        </Link>
        <div>
          <h1 className="text-2xl text-foreground-primary">{category?.label || "Category"}</h1>
          <p className="text-sm text-foreground-muted">{displayItems.length} items</p>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 overflow-x-auto hide-scrollbar">
        <button
          data-testid="filter-chip"
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
            activeFilter === "all" ? "bg-accent-blue text-white" : "bg-surface-card border border-border-subtle text-foreground-secondary"
          }`}
        >
          All
        </button>
        {ageBandKeys.map((band) => (
          <button
            key={band}
            data-testid="filter-chip"
            onClick={() => setActiveFilter(band)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
              activeFilter === band ? "bg-accent-blue text-white" : "bg-surface-card border border-border-subtle text-foreground-secondary"
            }`}
          >
            {AGE_BANDS[band].emoji} {AGE_BANDS[band].label}
          </button>
        ))}
      </div>

      <ContentGrid items={displayItems} />
    </div>
  );
}
