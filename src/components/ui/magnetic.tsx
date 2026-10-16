"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/** Gently pulls its child toward the mouse pointer. */
export function Magnetic({ children, strength = 0.3, className = "" }: MagneticProps) {
  // Measured on enter, before any offset is applied, so the pull doesn't feed back into itself.
  const rect = useRef<DOMRect | null>(null);

  const onEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || prefersReducedMotion()) return;
    rect.current = event.currentTarget.getBoundingClientRect();
  };
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const box = rect.current;
    if (!box) return;
    const x = (event.clientX - box.left - box.width / 2) * strength;
    const y = (event.clientY - box.top - box.height / 2) * strength;
    event.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = (event: PointerEvent<HTMLDivElement>) => {
    rect.current = null;
    event.currentTarget.style.transform = "";
  };

  return (
    <div
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-flex transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
