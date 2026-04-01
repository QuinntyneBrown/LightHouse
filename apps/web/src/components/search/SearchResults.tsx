"use client";

import React from "react";
import ContentGrid from "@/components/content/ContentGrid";
import type { AgeBand } from "@/lib/constants";

interface SearchResult {
  id: string;
  title: string;
  type: "video" | "audio";
  duration: string;
  ageBand: AgeBand;
  gradient?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  if (!query.trim()) return null;

  if (results.length === 0) {
    return (
      <div data-testid="search-results" className="flex flex-col items-center py-12 text-center">
        <span className="text-4xl mb-3">🔍</span>
        <p className="text-foreground-secondary font-medium">No results found</p>
        <p className="text-sm text-foreground-muted">Try a different search term</p>
      </div>
    );
  }

  return (
    <div data-testid="search-results">
      <p className="px-4 py-2 text-sm text-foreground-muted">{results.length} result{results.length !== 1 ? "s" : ""}</p>
      <ContentGrid items={results} />
    </div>
  );
}
