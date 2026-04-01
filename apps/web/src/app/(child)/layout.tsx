"use client";

import React from "react";
import AppShell from "@/components/shell/AppShell";

export default function ChildLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
