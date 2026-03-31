"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  filled?: boolean;
}

export default function Input({
  label,
  error,
  filled = false,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-foreground-secondary mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3 rounded-lg border text-foreground-primary
          placeholder:text-foreground-muted
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent
          ${error ? "border-red-400 bg-red-50" : filled ? "border-accent-blue bg-accent-blue-light" : "border-border-subtle bg-surface-card"}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
