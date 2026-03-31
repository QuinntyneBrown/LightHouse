"use client";

import React, { useState } from "react";
import BottomTabBar from "./BottomTabBar";
import ProfileSwitcher from "./ProfileSwitcher";
import ScreenTimeOverlay from "./ScreenTimeOverlay";
import OfflineIndicator from "./OfflineIndicator";
import { useProfile } from "@/hooks/useProfile";
import { useScreenTime } from "@/hooks/useScreenTime";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { profiles, activeProfile, switchProfile, switcherOpen, openSwitcher, closeSwitcher } = useProfile();
  const { overlayVisible, dismissOverlay } = useScreenTime();
  const [showPinEntry, setShowPinEntry] = useState(false);

  const handleParentPIN = () => {
    setShowPinEntry(true);
    dismissOverlay();
  };

  return (
    <div data-testid="app-shell" className="min-h-screen bg-surface-primary pb-20">
      <OfflineIndicator />

      {/* Header with profile switcher trigger */}
      <header className="sticky top-0 z-30 bg-surface-primary/95 backdrop-blur-sm border-b border-border-subtle px-4 py-3 flex items-center justify-between">
        <div data-testid="logo" className="text-xl font-bold text-accent-blue" style={{ fontFamily: "var(--font-family-heading)" }}>
          LightHouse
        </div>
        {activeProfile && (
          <button onClick={openSwitcher} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ backgroundColor: activeProfile.avatar.color }}
            >
              {activeProfile.avatar.icon}
            </div>
          </button>
        )}
      </header>

      <main className="max-w-lg mx-auto">
        {children}
      </main>

      <BottomTabBar />

      <ProfileSwitcher
        open={switcherOpen}
        onClose={closeSwitcher}
        profiles={profiles}
        activeProfileId={activeProfile?.id}
        onSelect={switchProfile}
      />

      <ScreenTimeOverlay
        visible={overlayVisible && !showPinEntry}
        onParentPIN={handleParentPIN}
      />
    </div>
  );
}
