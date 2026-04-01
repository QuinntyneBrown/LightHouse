"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ContentCard from "@/components/content/ContentCard";
import { MOCK_PLAYLISTS, MOCK_CONTENT } from "@/lib/constants";

export default function PlaylistDetailPage() {
  const params = useParams();
  const playlistId = params.id as string;
  const playlist = MOCK_PLAYLISTS.find((p) => p.id === playlistId) || MOCK_PLAYLISTS[0];

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-4 flex items-center gap-3">
        <Link href="/playlists" data-testid="back-button" className="w-10 h-10 rounded-full bg-surface-card border border-border-subtle flex items-center justify-center text-foreground-secondary hover:bg-surface-secondary">
          ←
        </Link>
        <div>
          <h1 className="text-2xl text-foreground-primary">{playlist.title}</h1>
          <p className="text-sm text-foreground-muted">{playlist.itemCount} items</p>
        </div>
      </div>

      {/* Playlist cover */}
      <div data-testid="playlist-cover" className={`mx-4 bg-gradient-to-br ${playlist.gradient} rounded-2xl p-8 flex flex-col items-center text-white`}>
        <span className="text-5xl mb-3">{playlist.icon}</span>
        <h2 className="text-xl font-semibold">{playlist.title}</h2>
        {playlist.description && (
          <p data-testid="playlist-description" className="text-sm text-white/80 mt-2 text-center max-w-xs">{playlist.description}</p>
        )}
      </div>

      {/* Items */}
      <div data-testid="playlist-items" className="flex flex-col gap-3 px-4">
        {MOCK_CONTENT.map((item, index) => (
          <div key={item.id} className="flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground-muted w-6 text-center">{index + 1}</span>
            <div className="flex-1">
              <ContentCard {...item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
