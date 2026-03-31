"use client";

import { useState, useEffect, useCallback } from "react";

export function useScreenTime() {
  const [remainingMinutes, setRemainingMinutes] = useState(30);
  const [limitMinutes] = useState(60);
  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    if (remainingMinutes <= 0) {
      setOverlayVisible(true);
    }
  }, [remainingMinutes]);

  const decrementTime = useCallback(() => {
    setRemainingMinutes((prev) => Math.max(0, prev - 1));
  }, []);

  const resetTime = useCallback(() => {
    setRemainingMinutes(limitMinutes);
    setOverlayVisible(false);
  }, [limitMinutes]);

  const dismissOverlay = useCallback(() => {
    setOverlayVisible(false);
  }, []);

  return { remainingMinutes, limitMinutes, overlayVisible, decrementTime, resetTime, dismissOverlay };
}
