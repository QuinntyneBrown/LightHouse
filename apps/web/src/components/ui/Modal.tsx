"use client";

import React, { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  "data-testid"?: string;
}

export default function Modal({ open, onClose, children, title, "data-testid": testId }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-testid={testId}
    >
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-surface-card rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto z-10">
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          {title && <h2 className="text-xl">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-full hover:bg-surface-secondary text-foreground-muted"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
