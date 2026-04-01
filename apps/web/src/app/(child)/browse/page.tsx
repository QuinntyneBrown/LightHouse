"use client";

import React from "react";
import CategoryButton from "@/components/content/CategoryButton";
import ContentGrid from "@/components/content/ContentGrid";
import { CATEGORIES, MOCK_CONTENT } from "@/lib/constants";

export default function BrowsePage() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="px-4">
        <h1 className="text-2xl text-foreground-primary mb-1">Browse</h1>
        <p className="text-sm text-foreground-muted">Discover something wonderful</p>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-3 gap-4 px-4">
        {CATEGORIES.map((cat) => (
          <CategoryButton key={cat.id} id={cat.id} label={cat.label} icon={cat.icon} color={cat.color} />
        ))}
      </div>

      {/* All content */}
      <section>
        <h2 className="text-xl px-4 mb-3 text-foreground-primary">All Content</h2>
        <ContentGrid items={MOCK_CONTENT} />
      </section>
    </div>
  );
}
