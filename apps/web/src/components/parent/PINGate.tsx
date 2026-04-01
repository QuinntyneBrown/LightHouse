"use client";

import React, { useState } from "react";
import PINEntry from "@/components/auth/PINEntry";

interface PINGateProps {
  children: React.ReactNode;
}

const MOCK_PIN = "1234";

export default function PINGate({ children }: PINGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  const handlePIN = (pin: string) => {
    if (pin === MOCK_PIN) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect PIN. Try again.");
    }
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-primary">
      <div className="w-full max-w-sm">
        <PINEntry onComplete={handlePIN} title="Parent Access" error={error} />
      </div>
    </div>
  );
}
