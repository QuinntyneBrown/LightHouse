"use client";

import React from "react";
import Link from "next/link";

interface PlaylistCardProps {
  id: string;
  title: string;
  icon: string;
  itemCount: number;
  gradient?: string;
  description?: string;
}

export default function PlaylistCard({ id, title, icon, itemCount, gradient = "from-accent-blue to-accent-purple" }: PlaylistCardProps) {
  return (
    <Link href={`/playlists/${id}`} data-testid="playlist-card" className="block">
      <div className={`bg-gradient-to-br ${gradient} rounded-xl p-4 text-white min-h-[100px] flex flex-col justify-between hover:shadow-lg transition-shadow`}>
        <span className="text-3xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-white/80">{itemCount} items</p>
        </div>
      </div>
    </Link>
  );
}
