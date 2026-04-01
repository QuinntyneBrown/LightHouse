"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import OAuthButtons from "@/components/auth/OAuthButtons";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (email: string, password: string) => {
    // Mock login
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-surface-primary">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl text-accent-blue mb-1">Welcome Back</h1>
          <p className="text-foreground-muted text-sm">Sign in to continue</p>
        </div>
        <LoginForm onSubmit={handleLogin} />
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
