"use client";

import React, { useEffect, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const typeStyles: Record<ToastType, { bg: string; icon: string }> = {
  success: { bg: "bg-accent-green text-white", icon: "✓" },
  error: { bg: "bg-red-500 text-white", icon: "✕" },
  warning: { bg: "bg-accent-gold text-white", icon: "⚠" },
  info: { bg: "bg-accent-blue text-white", icon: "ℹ" },
};

export default function Toast({ message, type = "info", visible, onClose, duration = 3000 }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible && !show) return null;

  const { bg, icon } = typeStyles[type];

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
      <div className={`${bg} px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 min-w-[200px]`}>
        <span className="text-lg">{icon}</span>
        <span className="font-medium text-sm">{message}</span>
        <button onClick={() => { setShow(false); onClose(); }} className="ml-2 opacity-80 hover:opacity-100">✕</button>
      </div>
    </div>
  );
}
