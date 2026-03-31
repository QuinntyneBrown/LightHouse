"use client";

import React from "react";
import Button from "@/components/ui/Button";

export default function OAuthButtons() {
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        fullWidth
        size="lg"
        data-testid="google-signup-button"
        onClick={() => {}}
      >
        <span className="mr-2">G</span> Continue with Google
      </Button>
      <Button
        variant="outline"
        fullWidth
        size="lg"
        data-testid="apple-signup-button"
        onClick={() => {}}
      >
        <span className="mr-2"></span> Continue with Apple
      </Button>
    </div>
  );
}
