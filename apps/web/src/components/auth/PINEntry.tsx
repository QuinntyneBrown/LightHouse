"use client";

import React, { useState, useCallback } from "react";

interface PINEntryProps {
  onComplete: (pin: string) => void;
  title?: string;
  error?: string;
}

export default function PINEntry({ onComplete, title = "Enter PIN", error }: PINEntryProps) {
  const [pin, setPin] = useState("");

  const handleDigit = useCallback((digit: string) => {
    setPin((prev) => {
      if (prev.length >= 4) return prev;
      const next = prev + digit;
      if (next.length === 4) {
        setTimeout(() => onComplete(next), 100);
      }
      return next;
    });
  }, [onComplete]);

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  return (
    <div data-testid="pin-entry" className="flex flex-col items-center gap-6 py-8">
      <h2 className="text-2xl text-foreground-primary">{title}</h2>

      {/* PIN dots */}
      <div data-testid="pin-dots" className="flex gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all ${
              i < pin.length ? "bg-accent-blue scale-110" : "bg-border-subtle"
            }`}
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Numpad */}
      <div data-testid="numpad" className="grid grid-cols-3 gap-3 w-64">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            data-testid={`pin-digit-${digit}`}
            onClick={() => handleDigit(String(digit))}
            className="w-20 h-14 rounded-xl bg-surface-card border border-border-subtle text-xl font-semibold text-foreground-primary hover:bg-surface-secondary active:bg-accent-blue-light transition-colors"
          >
            {digit}
          </button>
        ))}
        <div />
        <button
          data-testid="pin-digit-0"
          onClick={() => handleDigit("0")}
          className="w-20 h-14 rounded-xl bg-surface-card border border-border-subtle text-xl font-semibold text-foreground-primary hover:bg-surface-secondary active:bg-accent-blue-light transition-colors"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-20 h-14 rounded-xl bg-surface-card border border-border-subtle text-lg text-foreground-muted hover:bg-surface-secondary transition-colors"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
