"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProfileCreation from "@/components/profile/ProfileCreation";

export default function NewProfilePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link href="/profiles" data-testid="back-button" className="w-10 h-10 rounded-full bg-surface-card border border-border-subtle flex items-center justify-center text-foreground-secondary">
          ←
        </Link>
        <h1 className="text-2xl text-foreground-primary">New Profile</h1>
      </div>
      <ProfileCreation
        onSubmit={(data) => {
          // Mock save
          router.push("/profiles");
        }}
      />
    </div>
  );
}
