"use client";

import React, { useState } from "react";
import PINEntry from "./PINEntry";

interface PINSetupProps {
  onComplete: (pin: string) => void;
}

export default function PINSetup({ onComplete }: PINSetupProps) {
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState("");

  const handleFirst = (pin: string) => {
    setFirstPin(pin);
    setStep("confirm");
  };

  const handleConfirm = (pin: string) => {
    if (pin === firstPin) {
      onComplete(pin);
    } else {
      setError("PINs do not match. Try again.");
      setStep("enter");
      setFirstPin("");
    }
  };

  return (
    <div>
      {step === "enter" ? (
        <PINEntry onComplete={handleFirst} title="Create a PIN" error={error} />
      ) : (
        <PINEntry onComplete={handleConfirm} title="Confirm your PIN" />
      )}
    </div>
  );
}
