"use client";

import React from "react";
import PINGate from "@/components/parent/PINGate";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <PINGate>
      <div className="min-h-screen bg-surface-primary">
        <header className="sticky top-0 z-30 bg-surface-primary/95 backdrop-blur-sm border-b border-border-subtle px-4 py-3 flex items-center gap-3">
          <span className="text-xl">🔒</span>
          <h1 className="text-xl text-accent-blue" style={{ fontFamily: "var(--font-family-heading)" }}>Parent Dashboard</h1>
        </header>
        <main className="max-w-lg mx-auto p-4">
          {children}
        </main>
      </div>
    </PINGate>
  );
}
