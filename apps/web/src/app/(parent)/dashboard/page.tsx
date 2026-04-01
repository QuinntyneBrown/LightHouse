"use client";

import React from "react";
import Link from "next/link";
import ChildSummaryCard from "@/components/parent/ChildSummaryCard";
import ViewHistoryList from "@/components/parent/ViewHistoryList";
import Button from "@/components/ui/Button";
import { MOCK_PROFILES } from "@/lib/constants";

const MOCK_HISTORY = [
  { id: "1", title: "Noah's Ark Adventure", type: "video" as const, date: "Today, 2:30 PM", duration: "12 min" },
  { id: "2", title: "Jesus Loves Me", type: "audio" as const, date: "Today, 1:15 PM", duration: "3 min" },
  { id: "3", title: "Bedtime Prayer", type: "audio" as const, date: "Yesterday", duration: "5 min" },
];

export default function DashboardPage() {
  return (
    <div data-testid="parent-dashboard" className="flex flex-col gap-6">
      {/* Children summary */}
      <section data-testid="screen-time-section">
        <h2 className="text-xl mb-3 text-foreground-primary">Children</h2>
        <div className="flex flex-col gap-3">
          {MOCK_PROFILES.map((profile) => (
            <ChildSummaryCard
              key={profile.id}
              name={profile.name}
              ageBand={profile.ageBand}
              avatarIcon={profile.avatar.icon}
              avatarColor={profile.avatar.color}
              watchTimeMinutes={profile.id === "1" ? 35 : profile.id === "2" ? 55 : 10}
              limitMinutes={60}
            />
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-2 gap-3">
        <Link href="/screen-time">
          <Button variant="outline" fullWidth>Screen Time</Button>
        </Link>
        <Link href="/content-blocking">
          <Button variant="outline" fullWidth>Content</Button>
        </Link>
        <Link href="/history">
          <Button variant="outline" fullWidth>History</Button>
        </Link>
        <Link href="/profiles">
          <Button variant="outline" fullWidth>Profiles</Button>
        </Link>
      </section>

      {/* Recent activity */}
      <section>
        <h2 className="text-xl mb-3 text-foreground-primary">Recent Activity</h2>
        <ViewHistoryList items={MOCK_HISTORY} />
      </section>

      {/* Settings */}
      <Link href="/home">
        <Button variant="ghost" fullWidth data-testid="settings-button">
          ← Back to Kids View
        </Button>
      </Link>
    </div>
  );
}
