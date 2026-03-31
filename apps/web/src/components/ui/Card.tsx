import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", "data-testid": testId, onClick }: CardProps) {
  return (
    <div
      className={`bg-surface-card rounded-xl shadow-sm border border-border-subtle ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""} ${className}`}
      data-testid={testId}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
