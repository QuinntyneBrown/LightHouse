"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import type { Profile } from "@/hooks/useProfile";

interface ProfileSwitcherProps {
  open: boolean;
  onClose: () => void;
  profiles: Profile[];
  activeProfileId?: string;
  onSelect: (profileId: string) => void;
}

export default function ProfileSwitcher({ open, onClose, profiles, activeProfileId, onSelect }: ProfileSwitcherProps) {
  return (
    <Modal open={open} onClose={onClose} title="Who's Watching?" data-testid="profile-switcher">
      <div className="grid grid-cols-2 gap-4">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onSelect(profile.id)}
            className={`
              flex flex-col items-center gap-2 p-4 rounded-xl transition-all
              ${profile.id === activeProfileId ? "bg-accent-blue-light ring-2 ring-accent-blue" : "hover:bg-surface-secondary"}
            `}
          >
            <div
              data-testid="profile-avatar"
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: profile.avatar.color }}
            >
              {profile.avatar.icon}
            </div>
            <span data-testid="profile-name" className="font-medium text-foreground-primary">
              {profile.name}
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
