"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-surface-primary">
      <div className="flex flex-col items-center text-center max-w-sm">
        {/* Logo */}
        <div className="mb-2">
          <span className="text-5xl">⛪</span>
        </div>
        <h1 data-testid="logo" className="text-4xl text-accent-blue mb-2">LightHouse Kids</h1>
        <p data-testid="tagline" className="text-foreground-secondary mb-10">
          A safe place to explore God&apos;s Word
        </p>

        {/* Auth options */}
        <div className="w-full flex flex-col gap-3">
          <Link href="/signup" className="w-full">
            <Button fullWidth size="lg" data-testid="email-signup-button">
              Get Started
            </Button>
          </Link>

          <Button
            variant="outline"
            fullWidth
            size="lg"
            data-testid="google-signup-button"
            onClick={() => {}}
          >
            <span className="mr-2">G</span> Continue with Google
          </Button>

          <Button
            variant="outline"
            fullWidth
            size="lg"
            data-testid="apple-signup-button"
            onClick={() => {}}
          >
            <span className="mr-2"></span> Continue with Apple
          </Button>
        </div>

        <p className="text-sm text-foreground-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent-blue font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
