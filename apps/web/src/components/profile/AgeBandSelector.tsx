"use client";

import React from "react";
import type { AgeBand } from "@/lib/constants";
import { AGE_BANDS } from "@/lib/constants";

interface AgeBandSelectorProps {
  selected?: AgeBand;
  onSelect: (band: AgeBand) => void;
}

const bands: AgeBand[] = ["seedlings", "sprouts", "explorers"];

export default function AgeBandSelector({ selected, onSelect }: AgeBandSelectorProps) {
  return (
    <div data-testid="age-band-selector" className="flex flex-col gap-3">
      {bands.map((band) => {
        const info = AGE_BANDS[band];
        const isSelected = selected === band;
        return (
          <button
            key={band}
            onClick={() => onSelect(band)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
              isSelected
                ? "border-accent-blue bg-accent-blue-light"
                : "border-border-subtle bg-surface-card hover:border-accent-blue/30"
            }`}
          >
            <span className="text-3xl">{info.emoji}</span>
            <div>
              <h3 className="font-semibold text-foreground-primary">{info.label}</h3>
              <p className="text-xs text-foreground-muted">Ages {info.ageRange}</p>
              <p className="text-xs text-foreground-secondary mt-0.5">{info.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
