"use client";

import React from "react";

const AVATARS = [
  { id: "1", icon: "🦋", color: "#FF7E6B" },
  { id: "2", icon: "🦁", color: "#F5A623" },
  { id: "3", icon: "🐣", color: "#9B7ED8" },
  { id: "4", icon: "🐬", color: "#3B82C4" },
  { id: "5", icon: "🌻", color: "#4CAF6E" },
  { id: "6", icon: "⭐", color: "#FF7E6B" },
];

interface AvatarPickerProps {
  selectedId?: string;
  onSelect: (avatar: { id: string; icon: string; color: string }) => void;
}

export default function AvatarPicker({ selectedId, onSelect }: AvatarPickerProps) {
  return (
    <div data-testid="avatar-picker" className="grid grid-cols-3 gap-4">
      {AVATARS.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelect(avatar)}
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl transition-all ${
            selectedId === avatar.id
              ? "ring-3 ring-accent-blue ring-offset-2 scale-110"
              : "hover:scale-105"
          }`}
          style={{ background: `linear-gradient(135deg, ${avatar.color}, ${avatar.color}CC)` }}
        >
          {avatar.icon}
        </button>
      ))}
    </div>
  );
}
