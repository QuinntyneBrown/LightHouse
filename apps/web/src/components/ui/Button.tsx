"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold" | "coral" | "green" | "purple";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent-blue text-white hover:bg-accent-blue/90 active:bg-accent-blue/80",
  secondary: "bg-surface-secondary text-foreground-primary hover:bg-surface-secondary/80",
  outline: "bg-transparent border-2 border-accent-blue text-accent-blue hover:bg-accent-blue-light",
  ghost: "bg-transparent text-foreground-secondary hover:bg-surface-secondary",
  danger: "bg-red-500 text-white hover:bg-red-600",
  gold: "bg-accent-gold text-white hover:bg-accent-gold/90",
  coral: "bg-accent-coral text-white hover:bg-accent-coral/90",
  green: "bg-accent-green text-white hover:bg-accent-green/90",
  purple: "bg-accent-purple text-white hover:bg-accent-purple/90",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm min-h-[32px]",
  md: "px-5 py-2.5 text-base min-h-[40px]",
  lg: "px-7 py-3.5 text-lg min-h-[48px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        rounded-lg transition-all duration-200 select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}
