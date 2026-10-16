"use client";

import { useRef, type HTMLAttributes, type PointerEvent } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Exposes the mouse position as `--px` / `--py` (-0.5 to 0.5) on itself; CSS turns them into
 * tilt and parallax (see `.tilt-surface` and `.parallax-layer`). Touch input is ignored.
 */
export function PointerTilt({ children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const frame = useRef(0);
  const enabled = useRef(false);

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    enabled.current = event.pointerType === "mouse" && !prefersReducedMotion();
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled.current) return;
    const node = event.currentTarget;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--px", ((clientX - rect.left) / rect.width - 0.5).toFixed(3));
      node.style.setProperty("--py", ((clientY - rect.top) / rect.height - 0.5).toFixed(3));
    });
  };
  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    cancelAnimationFrame(frame.current);
    event.currentTarget.style.setProperty("--px", "0");
    event.currentTarget.style.setProperty("--py", "0");
  };

  return (
    <div onPointerEnter={onPointerEnter} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} {...rest}>
      {children}
    </div>
  );
}
