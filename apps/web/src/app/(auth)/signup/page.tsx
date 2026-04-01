"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SignupForm from "@/components/auth/SignupForm";
import OAuthButtons from "@/components/auth/OAuthButtons";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (email: string, password: string) => {
    router.push("/consent");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-surface-primary">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-accent-blue mb-1">Create Account</h1>
          <p className="text-foreground-muted text-sm">Start your family&apos;s journey</p>
        </div>
        <SignupForm onSubmit={handleSignup} />
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border-subtle" />
          <span className="text-xs text-foreground-muted">or</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>
        <OAuthButtons />
      </div>
    </div>
  );
}
