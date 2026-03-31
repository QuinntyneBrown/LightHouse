"use client";

import React from "react";
import Link from "next/link";

interface CategoryButtonProps {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export default function CategoryButton({ id, label, icon, color }: CategoryButtonProps) {
  return (
    <Link
      href={`/browse/${id}`}
      data-testid="category-button"
      className="flex flex-col items-center gap-1.5 min-w-[80px]"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: color + "20" }}
      >
        {icon}
      </div>
      <span className="text-xs font-medium text-foreground-secondary text-center leading-tight">
        {label}
      </span>
    </Link>
  );
}
