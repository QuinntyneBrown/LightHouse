"use client";

import { useState, useEffect, useMemo } from "react";
import { MOCK_CONTENT } from "@/lib/constants";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return MOCK_CONTENT.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  const isSearching = query !== debouncedQuery;

  return { query, setQuery, results, isSearching };
}
