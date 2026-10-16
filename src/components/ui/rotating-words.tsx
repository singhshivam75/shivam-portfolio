"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface RotatingWordsProps {
  words: readonly string[];
  interval?: number;
  className?: string;
}

export function RotatingWords({ words, interval = 2600, className = "" }: RotatingWordsProps) {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    if (words.length < 2 || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") setTicks((value) => value + 1);
    }, interval);
    return () => window.clearInterval(id);
  }, [interval, words.length]);

  const word = words[ticks % Math.max(words.length, 1)] ?? "";

  return (
    <span className={`relative inline-grid overflow-hidden align-bottom ${className}`}>
      <span className="sr-only">{words.join(", ")}</span>
      <span key={ticks} aria-hidden="true" className={`col-start-1 row-start-1 whitespace-nowrap ${ticks > 0 ? "word-in" : ""}`}>
        {word}
      </span>
    </span>
  );
}
