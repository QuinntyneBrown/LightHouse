import React from "react";

interface MemoryVerseProps {
  verse?: string;
  reference?: string;
}

export default function MemoryVerse({
  verse = "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
  reference = "John 3:16",
}: MemoryVerseProps) {
  return (
    <div className="bg-gradient-to-br from-accent-blue-light to-accent-gold-light rounded-xl p-5 border border-border-subtle">
      <p className="text-sm text-foreground-secondary italic leading-relaxed">&ldquo;{verse}&rdquo;</p>
      <p className="text-xs font-semibold text-accent-blue mt-2">- {reference}</p>
    </div>
  );
}
