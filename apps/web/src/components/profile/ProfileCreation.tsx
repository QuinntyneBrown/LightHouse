"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AvatarPicker from "./AvatarPicker";
import AgeBandSelector from "./AgeBandSelector";
import type { AgeBand } from "@/lib/constants";

interface ProfileCreationProps {
  onSubmit?: (data: { name: string; ageBand: AgeBand; avatar: { id: string; icon: string; color: string } }) => void;
}

export default function ProfileCreation({ onSubmit }: ProfileCreationProps) {
  const [name, setName] = useState("");
  const [ageBand, setAgeBand] = useState<AgeBand | undefined>();
  const [avatar, setAvatar] = useState<{ id: string; icon: string; color: string } | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && ageBand && avatar) {
      onSubmit?.({ name, ageBand, avatar });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">
      <div>
        <h3 className="font-semibold text-foreground-primary mb-2">Child&apos;s Name</h3>
        <Input
          data-testid="name-input"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <h3 className="font-semibold text-foreground-primary mb-2">Age Group</h3>
        <AgeBandSelector selected={ageBand} onSelect={setAgeBand} />
      </div>

      <div>
        <h3 className="font-semibold text-foreground-primary mb-2">Choose an Avatar</h3>
        <AvatarPicker selectedId={avatar?.id} onSelect={setAvatar} />
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        data-testid="create-profile-button"
        disabled={!name || !ageBand || !avatar}
      >
        Create Profile
      </Button>
    </form>
  );
}
