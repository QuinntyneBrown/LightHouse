"use client";

import React from "react";
import PlaylistCard from "@/components/content/PlaylistCard";
import { MOCK_PLAYLISTS } from "@/lib/constants";

export default function PlaylistsPage() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-4">
        <h1 className="text-2xl text-foreground-primary mb-1">Playlists</h1>
        <p className="text-sm text-foreground-muted">Curated collections for your little one</p>
      </div>
      <div className="grid grid-cols-2 gap-3 px-4">
        {MOCK_PLAYLISTS.map((pl) => (
          <PlaylistCard key={pl.id} {...pl} />
        ))}
      </div>
    </div>
  );
}
