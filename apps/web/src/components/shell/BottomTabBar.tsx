"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { id: "home", label: "Home", icon: "🏠", href: "/home" },
  { id: "browse", label: "Browse", icon: "🔍", href: "/browse" },
  { id: "playlists", label: "Playlists", icon: "🎵", href: "/playlists" },
  { id: "parent", label: "Parent", icon: "🔒", href: "/dashboard" },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/home") return pathname === "/home" || pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      data-testid="bottom-tab-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface-card border-t border-border-subtle"
      style={{ minHeight: 48 }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1.5">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              data-testid={`tab-${tab.id}`}
              className={`
                flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-full
                min-w-[64px] min-h-[48px] transition-all duration-200
                ${active
                  ? "bg-accent-blue-light text-accent-blue"
                  : "text-foreground-muted hover:text-foreground-secondary"
                }
              `}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
