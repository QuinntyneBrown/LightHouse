"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function ConsentPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
    if (agreed) {
      router.push("/pin-setup");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-surface-primary">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">🛡️</span>
          <h1 className="text-3xl text-accent-blue mt-3 mb-1">Parental Consent</h1>
          <p className="text-foreground-muted text-sm">COPPA Compliance</p>
        </div>

        <div className="bg-surface-card rounded-xl border border-border-subtle p-4 mb-6 text-sm text-foreground-secondary leading-relaxed">
          <p className="mb-3">
            LightHouse Kids is designed for children under 13. As required by the Children&apos;s Online Privacy Protection Act (COPPA), we need your consent as a parent or guardian.
          </p>
          <p className="mb-3">
            We collect minimal data necessary to provide a safe, personalized experience. Your child&apos;s data will never be shared with third parties for advertising purposes.
          </p>
          <p>
            You can review, modify, or delete your child&apos;s data at any time through the Parent Dashboard.
          </p>
        </div>

        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 accent-accent-blue rounded"
          />
          <span className="text-sm text-foreground-secondary">
            I am a parent or legal guardian and I consent to the collection and use of my child&apos;s information as described above.
          </span>
        </label>

        <Button fullWidth size="lg" onClick={handleContinue} disabled={!agreed}>
          Continue
        </Button>
      </div>
    </div>
  );
}
