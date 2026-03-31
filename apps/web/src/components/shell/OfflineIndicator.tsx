"use client";

import React from "react";
import { useOffline } from "@/hooks/useOffline";

export default function OfflineIndicator() {
  const { isOffline } = useOffline();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] bg-foreground-muted text-white text-center text-xs py-1 font-medium">
      You are offline. Some features may not be available.
    </div>
  );
}
