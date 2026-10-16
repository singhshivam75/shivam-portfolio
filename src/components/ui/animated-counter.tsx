"use client";

import { useEffect, useRef } from "react";
import { easeOutExpo, prefersReducedMotion } from "@/lib/motion";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

const DURATION = 1600;

/** Counts every number inside `value` up from zero, keeping surrounding symbols (e.g. "30–40%"). */
export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    const parts = value.split(/(\d+)/);
    let frame = 0;

    const render = (progress: number) => {
      node.textContent = parts
        .map((part) => (/^\d+$/.test(part) ? String(Math.round(Number(part) * progress)) : part))
        .join("");
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          render(easeOutExpo(t));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      node.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
