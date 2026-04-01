"use client";

import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Search for stories, songs..." }: SearchInputProps) {
  return (
    <div data-testid="search-input" className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border-subtle bg-surface-card text-foreground-primary placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
      />
    </div>
  );
}
