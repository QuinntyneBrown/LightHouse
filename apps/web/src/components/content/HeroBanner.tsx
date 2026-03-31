"use client";

import React from "react";

interface HeroBannerProps {
  childName: string;
  avatarIcon: string;
  avatarColor: string;
}

export default function HeroBanner({ childName, avatarIcon, avatarColor }: HeroBannerProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div
      data-testid="hero-banner"
      className="bg-gradient-to-br from-accent-blue to-accent-blue/80 rounded-2xl mx-4 mt-4 p-6 text-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-6 -translate-x-4" />

      <div className="relative flex items-center gap-4">
        <div
          data-testid="child-avatar"
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl ring-2 ring-white/30 flex-shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          {avatarIcon}
        </div>
        <div>
          <p data-testid="greeting" className="text-sm text-white/80">{greeting}</p>
          <h1 data-testid="child-name" className="text-2xl">{childName}!</h1>
          <p className="text-sm text-white/70 mt-0.5">Ready to explore?</p>
        </div>
      </div>
    </div>
  );
}
