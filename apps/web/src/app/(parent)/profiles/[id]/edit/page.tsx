"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AgeBandSelector from "@/components/profile/AgeBandSelector";
import AvatarPicker from "@/components/profile/AvatarPicker";
import { MOCK_PROFILES } from "@/lib/constants";
import type { AgeBand } from "@/lib/constants";

export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id as string;
  const profile = MOCK_PROFILES.find((p) => p.id === profileId) || MOCK_PROFILES[0];

  const [name, setName] = useState(profile.name);
  const [ageBand, setAgeBand] = useState<AgeBand>(profile.ageBand);
  const [avatar, setAvatar] = useState<{ id: string; icon: string; color: string }>({
    id: "1",
    icon: profile.avatar.icon,
    color: profile.avatar.color,
  });

  const handleSave = () => {
    // Mock save
    router.push("/profiles");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/profiles" data-testid="back-button" className="w-10 h-10 rounded-full bg-surface-card border border-border-subtle flex items-center justify-center text-foreground-secondary">
          ←
        </Link>
        <h1 className="text-2xl text-foreground-primary">Edit Profile</h1>
      </div>

      <div>
        <h3 className="font-semibold text-foreground-primary mb-2">Name</h3>
        <Input
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <h3 className="font-semibold text-foreground-primary mb-2">Age Group</h3>
        <AgeBandSelector selected={ageBand} onSelect={setAgeBand} />
      </div>

      <div>
        <h3 className="font-semibold text-foreground-primary mb-2">Avatar</h3>
        <AvatarPicker selectedId={avatar.id} onSelect={setAvatar} />
      </div>

      <div className="flex gap-3">
        <Button variant="primary" fullWidth onClick={handleSave}>
          Save Changes
        </Button>
        <Button variant="danger" fullWidth onClick={() => router.push("/profiles")}>
          Delete Profile
        </Button>
      </div>
    </div>
  );
}
