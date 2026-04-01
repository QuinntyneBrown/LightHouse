"use client";

import React, { useState } from "react";
import Link from "next/link";
import ScreenTimeSlider from "@/components/parent/ScreenTimeSlider";
import { MOCK_PROFILES } from "@/lib/constants";

export default function ScreenTimePage() {
  const [limits, setLimits] = useState<Record<string, number>>({
    "1": 60,
    "2": 45,
    "3": 30,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard" data-testid="back-button" className="w-10 h-10 rounded-full bg-surface-card border border-border-subtle flex items-center justify-center text-foreground-secondary">
          ←
        </Link>
        <h1 className="text-2xl text-foreground-primary">Screen Time</h1>
      </div>
      {MOCK_PROFILES.map((profile) => (
        <ScreenTimeSlider
          key={profile.id}
          childName={profile.name}
          value={limits[profile.id] || 60}
          onChange={(v) => setLimits((prev) => ({ ...prev, [profile.id]: v }))}
        />
      ))}
    </div>
  );
}
