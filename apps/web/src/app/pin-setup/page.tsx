"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PINSetup from "@/components/auth/PINSetup";

export default function PinSetupPage() {
  const router = useRouter();

  const handleComplete = (pin: string) => {
    // Store PIN (mock)
    router.push("/profiles/new");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-surface-primary">
      <div className="w-full max-w-sm">
        <div className="text-center mb-4">
          <span className="text-4xl">🔐</span>
          <p className="text-sm text-foreground-muted mt-2">This PIN protects parent settings</p>
        </div>
        <PINSetup onComplete={handleComplete} />
      </div>
    </div>
  );
}
