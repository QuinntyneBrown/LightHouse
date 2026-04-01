"use client";

import React from "react";

interface ScreenTimeSliderProps {
  childName: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function ScreenTimeSlider({ childName, value, onChange, min = 15, max = 180 }: ScreenTimeSliderProps) {
  return (
    <div className="bg-surface-card rounded-xl border border-border-subtle p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-foreground-primary">{childName}</h3>
        <span className="text-accent-blue font-semibold">{value} min</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={15}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-border-subtle rounded-full appearance-none cursor-pointer accent-accent-blue"
      />
      <div className="flex justify-between text-xs text-foreground-muted mt-1">
        <span>{min} min</span>
        <span>{max} min</span>
      </div>
    </div>
  );
}
