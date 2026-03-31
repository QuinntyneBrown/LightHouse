"use client";

import React, { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface SignupFormProps {
  onSubmit?: (email: string, password: string) => void;
}

export default function SignupForm({ onSubmit }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    onSubmit?.(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="parent@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={error}
        required
      />
      <Button type="submit" fullWidth size="lg" data-testid="email-signup-button">
        Create Account
      </Button>
      <p className="text-center text-sm text-foreground-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent-blue font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}
