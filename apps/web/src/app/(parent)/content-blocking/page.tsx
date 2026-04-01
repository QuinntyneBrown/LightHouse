"use client";

import React, { useState } from "react";
import Link from "next/link";
import ContentBlockToggle from "@/components/parent/ContentBlockToggle";
import { MOCK_CONTENT } from "@/lib/constants";

export default function ContentBlockingPage() {
  const [blocked, setBlocked] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard" data-testid="back-button" className="w-10 h-10 rounded-full bg-surface-card border border-border-subtle flex items-center justify-center text-foreground-secondary">
          ←
        </Link>
        <h1 className="text-2xl text-foreground-primary">Content Management</h1>
      </div>
      <div className="flex flex-col gap-2">
        {MOCK_CONTENT.map((item) => (
          <ContentBlockToggle
            key={item.id}
            title={item.title}
            type={item.type}
            blocked={blocked[item.id] || false}
            onToggle={() => setBlocked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
          />
        ))}
      </div>
    </div>
  );
}
