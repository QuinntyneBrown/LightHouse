"use client";

import React from "react";

interface ScreenTimeOverlayProps {
  visible: boolean;
  onParentPIN: () => void;
}

export default function ScreenTimeOverlay({ visible, onParentPIN }: ScreenTimeOverlayProps) {
  if (!visible) return null;

  return (
    <div
      data-testid="screen-time-overlay"
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center text-center p-8"
      style={{
        background: "linear-gradient(135deg, #FFF8F0 0%, #FFF0E0 50%, #FFE8CC 100%)",
      }}
    >
      <div className="text-7xl mb-6">☀️</div>
      <h1 className="text-4xl mb-4 text-foreground-primary">Great Job Today!</h1>
      <p data-testid="friendly-message" className="text-lg text-foreground-secondary mb-8 max-w-xs">
        You&apos;ve had a wonderful time learning and exploring. Time for a break!
      </p>
      <div className="flex gap-2 mb-10">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-3xl">⭐</span>
        ))}
      </div>
      <button
        data-testid="parent-pin-button"
        onClick={onParentPIN}
        className="px-6 py-3 bg-accent-blue text-white rounded-lg font-semibold text-sm hover:bg-accent-blue/90 transition-colors"
      >
        Parent PIN
      </button>
    </div>
  );
}
