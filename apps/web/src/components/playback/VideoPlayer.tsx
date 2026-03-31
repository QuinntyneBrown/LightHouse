"use client";

import React from "react";
import { usePlayer } from "@/hooks/usePlayer";

interface VideoPlayerProps {
  title: string;
  duration?: number;
}

export default function VideoPlayer({ title, duration = 720 }: VideoPlayerProps) {
  const player = usePlayer(duration);

  return (
    <div data-testid="video-player" className="bg-foreground-primary rounded-xl overflow-hidden">
      {/* Video area */}
      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center justify-center gap-6">
          <button
            data-testid="rewind-button"
            onClick={() => player.rewind(10)}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-lg transition-colors"
          >
            ⏪
          </button>
          <button
            data-testid="play-pause-button"
            onClick={player.togglePlay}
            className="w-16 h-16 rounded-full bg-white/30 hover:bg-white/40 flex items-center justify-center text-white text-2xl transition-colors"
          >
            {player.isPlaying ? "⏸" : "▶"}
          </button>
          <button
            data-testid="forward-button"
            onClick={() => player.forward(10)}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-lg transition-colors"
          >
            ⏩
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3">
        <div data-testid="progress-bar" className="w-full h-1.5 bg-white/20 rounded-full mb-2 cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          player.seek(ratio * player.duration);
        }}>
          <div className="h-full bg-accent-blue rounded-full transition-all" style={{ width: `${player.progress * 100}%` }} />
        </div>
        <div className="flex justify-between text-xs text-white/60">
          <span>{player.formatTime(player.currentTime)}</span>
          <span>{player.formatTime(player.duration)}</span>
        </div>
        <h3 className="text-white font-medium text-sm mt-1">{title}</h3>
      </div>
    </div>
  );
}
