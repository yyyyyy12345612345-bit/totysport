"use client";

import { useState, useEffect } from "react";
import { TotyMatchIntro } from "@/components/intros/TotyMatchIntro";

// In-memory session flag: persists during SPA route navigation, resets on browser page reload (F5)
let sessionIntroPlayed = false;

export function IntroScreen({ onComplete }: { onComplete?: () => void }) {
  const [showIntro, setShowIntro] = useState(!sessionIntroPlayed);

  useEffect(() => {
    // Listen for manual trigger event (e.g. from settings or intro lab)
    const handleManualTrigger = () => {
      setShowIntro(true);
    };

    window.addEventListener("toty_trigger_intro", handleManualTrigger);
    window.addEventListener("nxt_trigger_intro", handleManualTrigger);
    return () => {
      window.removeEventListener("toty_trigger_intro", handleManualTrigger);
      window.removeEventListener("nxt_trigger_intro", handleManualTrigger);
    };
  }, []);

  const handleComplete = () => {
    sessionIntroPlayed = true;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("toty_intro_played", "true");
    }
    setShowIntro(false);
    if (onComplete) {
      onComplete();
    }
  };

  if (!showIntro) return null;

  return <TotyMatchIntro onComplete={handleComplete} />;
}
