"use client";

import React from "react";
import Link from "next/link";
import ProfileCard from "@/components/profile/ProfileCard";
import Button from "@/components/ui/Button";
import { MOCK_PROFILES } from "@/lib/constants";

export default function ProfilesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/dashboard" data-testid="back-button" className="w-10 h-10 rounded-full bg-surface-card border border-border-subtle flex items-center justify-center text-foreground-secondary">
          ←
        </Link>
        <h1 className="text-2xl text-foreground-primary">Profiles</h1>
      </div>
      <div className="flex flex-col gap-3">
        {MOCK_PROFILES.map((profile) => (
          <Link key={profile.id} href={`/profiles/${profile.id}/edit`}>
            <ProfileCard
              name={profile.name}
              ageBand={profile.ageBand}
              avatarIcon={profile.avatar.icon}
              avatarColor={profile.avatar.color}
            />
          </Link>
        ))}
      </div>
      <Link href="/profiles/new">
        <Button variant="primary" fullWidth>
          + Add Child
        </Button>
      </Link>
    </div>
  );
}
