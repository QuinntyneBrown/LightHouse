"use client";

import React from "react";
import SearchInput from "@/components/search/SearchInput";
import SearchResults from "@/components/search/SearchResults";
import CategoryButton from "@/components/content/CategoryButton";
import { useSearch } from "@/hooks/useSearch";
import { CATEGORIES } from "@/lib/constants";

export default function SearchPage() {
  const { query, setQuery, results, isSearching } = useSearch();

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-4">
        <h1 className="text-2xl text-foreground-primary mb-3">Search</h1>
        <SearchInput value={query} onChange={setQuery} />
      </div>

      {!query.trim() && (
        <section>
          <h2 className="text-lg px-4 mb-3 text-foreground-primary" style={{ fontFamily: "var(--font-family-heading)" }}>Categories</h2>
          <div className="grid grid-cols-3 gap-4 px-4">
            {CATEGORIES.map((cat) => (
              <CategoryButton key={cat.id} id={cat.id} label={cat.label} icon={cat.icon} color={cat.color} />
            ))}
          </div>
        </section>
      )}

      {isSearching && (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <SearchResults results={results} query={query} />
    </div>
  );
}
