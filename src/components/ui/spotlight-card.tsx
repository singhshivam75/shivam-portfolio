"use client";

import type { HTMLAttributes, PointerEvent, ReactNode } from "react";

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glowBorder?: boolean;
}

/** Glass card with a pointer-tracked radial highlight. */
export function SpotlightCard({ children, glowBorder = false, className = "", ...rest }: SpotlightCardProps) {
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      onPointerMove={onPointerMove}
      className={`glass spotlight group rounded-3xl transition duration-500 hover:border-violet-glow/30 ${glowBorder ? "border-glow" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
