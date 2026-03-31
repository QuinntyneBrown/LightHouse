"use client";

import { useState, useCallback } from "react";

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
}

export function usePlayer(totalDuration: number = 180) {
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: totalDuration,
    progress: 0,
  });

  const togglePlay = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: !s.isPlaying }));
  }, []);

  const seek = useCallback((time: number) => {
    setState((s) => ({
      ...s,
      currentTime: Math.max(0, Math.min(time, s.duration)),
      progress: Math.max(0, Math.min(time / s.duration, 1)),
    }));
  }, []);

  const rewind = useCallback((seconds: number = 10) => {
    setState((s) => {
      const newTime = Math.max(0, s.currentTime - seconds);
      return { ...s, currentTime: newTime, progress: newTime / s.duration };
    });
  }, []);

  const forward = useCallback((seconds: number = 10) => {
    setState((s) => {
      const newTime = Math.min(s.duration, s.currentTime + seconds);
      return { ...s, currentTime: newTime, progress: newTime / s.duration };
    });
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  return { ...state, togglePlay, seek, rewind, forward, formatTime };
}
