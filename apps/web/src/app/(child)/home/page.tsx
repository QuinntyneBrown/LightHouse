"use client";

import React from "react";
import HeroBanner from "@/components/content/HeroBanner";
import CategoryButton from "@/components/content/CategoryButton";
import ContentCarousel from "@/components/content/ContentCarousel";
import PlaylistCard from "@/components/content/PlaylistCard";
import MemoryVerse from "@/components/engagement/MemoryVerse";
import { CATEGORIES, MOCK_CONTENT, MOCK_PLAYLISTS, MOCK_PROFILES } from "@/lib/constants";

export default function HomePage() {
  const activeProfile = MOCK_PROFILES[0];

  return (
    <div className="flex flex-col gap-6 pb-6">
      <HeroBanner
        childName={activeProfile.name}
        avatarIcon={activeProfile.avatar.icon}
        avatarColor={activeProfile.avatar.color}
      />

      {/* Categories */}
      <section>
        <h2 className="text-xl px-4 mb-3 text-foreground-primary">Explore</h2>
        <div data-testid="category-row" className="flex gap-3 overflow-x-auto hide-scrollbar px-4 pb-2">
          {CATEGORIES.map((cat) => (
            <CategoryButton key={cat.id} id={cat.id} label={cat.label} icon={cat.icon} color={cat.color} />
          ))}
        </div>
      </section>

      {/* Featured content */}
      <ContentCarousel items={MOCK_CONTENT} title="Featured" />

      {/* Playlists */}
      <section data-testid="playlist-section">
        <h2 className="text-xl px-4 mb-3 text-foreground-primary">Playlists</h2>
        <div className="grid grid-cols-2 gap-3 px-4">
          {MOCK_PLAYLISTS.map((pl) => (
            <PlaylistCard key={pl.id} {...pl} />
          ))}
        </div>
      </section>

      {/* Memory verse */}
      <section className="px-4">
        <h2 className="text-xl mb-3 text-foreground-primary">Today&apos;s Verse</h2>
        <MemoryVerse />
      </section>
    </div>
  );
}
