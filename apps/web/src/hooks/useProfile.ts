"use client";

import { useState, useCallback } from "react";
import { MOCK_PROFILES } from "@/lib/constants";
import type { AgeBand } from "@/lib/constants";

export interface Profile {
  id: string;
  name: string;
  ageBand: AgeBand;
  avatar: { color: string; icon: string };
}

export function useProfile() {
  const [profiles] = useState<Profile[]>(MOCK_PROFILES);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(MOCK_PROFILES[0]);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const switchProfile = useCallback((profileId: string) => {
    const profile = MOCK_PROFILES.find((p) => p.id === profileId);
    if (profile) {
      setActiveProfile(profile);
      setSwitcherOpen(false);
    }
  }, []);

  const openSwitcher = useCallback(() => setSwitcherOpen(true), []);
  const closeSwitcher = useCallback(() => setSwitcherOpen(false), []);

  return { profiles, activeProfile, switchProfile, switcherOpen, openSwitcher, closeSwitcher };
}
