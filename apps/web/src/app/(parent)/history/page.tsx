"use client";

import React from "react";
import Link from "next/link";
import ViewHistoryList from "@/components/parent/ViewHistoryList";

const MOCK_HISTORY = [
  { id: "1", title: "Noah's Ark Adventure", type: "video" as const, date: "Today, 2:30 PM", duration: "12 min" },
  { id: "2", title: "Jesus Loves Me", type: "audio" as const, date: "Today, 1:15 PM", duration: "3 min" },
  { id: "3", title: "Bedtime Prayer", type: "audio" as const, date: "Yesterday", duration: "5 min" },
  { id: "4", title: "David & Goliath", type: "video" as const, date: "Yesterday", duration: "15 min" },
  { id: "5", title: "Creation Song", type: "audio" as const, date: "2 days ago", duration: "4 min" },
];

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard" data-testid="back-button" className="w-10 h-10 rounded-full bg-surface-card border border-border-subtle flex items-center justify-center text-foreground-secondary">
          ←
        </Link>
        <h1 className="text-2xl text-foreground-primary">Watch History</h1>
      </div>
      <ViewHistoryList items={MOCK_HISTORY} />
    </div>
  );
}
