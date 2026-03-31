"use client";

import React from "react";
import { usePlayer } from "@/hooks/usePlayer";

interface AudioPlayerProps {
  title: string;
  artist?: string;
  gradient?: string;
  duration?: number;
}

export default function AudioPlayer({ title, artist = "LightHouse Kids", gradient = "from-accent-purple to-accent-blue", duration = 180 }: AudioPlayerProps) {
  const player = usePlayer(duration);

  return (
    <div data-testid="audio-player" className="flex flex-col items-center px-4 py-6">
      {/* Cover art */}
      <div
        data-testid="cover-art"
        className={`w-64 h-64 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl mb-8`}
      >
        <span className="text-7xl text-white/80">🎵</span>
      </div>

      {/* Title & artist */}
      <h2 className="text-xl font-semibold text-foreground-primary text-center">{title}</h2>
      <p className="text-sm text-foreground-muted mt-1">{artist}</p>

      {/* Progress */}
      <div className="w-full mt-6">
        <div data-testid="progress-bar" className="w-full h-1.5 bg-border-subtle rounded-full cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          player.seek(ratio * player.duration);
        }}>
          <div className="h-full bg-accent-blue rounded-full transition-all" style={{ width: `${player.progress * 100}%` }} />
        </div>
        <div className="flex justify-between text-xs text-foreground-muted mt-1">
          <span>{player.formatTime(player.currentTime)}</span>
          <span>{player.formatTime(player.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8 mt-6">
        <button className="w-12 h-12 rounded-full hover:bg-surface-secondary flex items-center justify-center text-xl text-foreground-secondary transition-colors">
          ⏮
        </button>
        <button
          data-testid="play-pause-button"
          onClick={player.togglePlay}
          className="w-16 h-16 rounded-full bg-accent-blue hover:bg-accent-blue/90 flex items-center justify-center text-2xl text-white transition-colors shadow-lg"
        >
          {player.isPlaying ? "⏸" : "▶"}
        </button>
        <button className="w-12 h-12 rounded-full hover:bg-surface-secondary flex items-center justify-center text-xl text-foreground-secondary transition-colors">
          ⏭
        </button>
      </div>
    </div>
  );
}
