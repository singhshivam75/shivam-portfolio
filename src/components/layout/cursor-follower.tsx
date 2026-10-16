"use client";

import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "link" | "text" | "label";

const INTERACTIVE = "a, button, [role='button'], [data-cursor], summary, label";
const RING_SIZE: Record<CursorMode, number> = { default: 34, link: 54, text: 6, label: 84 };
const RING_FILL: Record<CursorMode, string> = {
  default: "rgba(0, 0, 0, 0)",
  link: "rgba(34, 211, 238, 0.12)",
  text: "rgba(0, 0, 0, 0)",
  label: "rgba(139, 92, 246, 0.85)",
};

export default function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const target = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let frame = 0;

    // Eases the ring toward the pointer and stops once it has caught up.
    const tick = () => {
      ring.x += (target.x - ring.x) * 0.24;
      ring.y += (target.y - ring.y) * 0.24;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      frame = Math.abs(target.x - ring.x) + Math.abs(target.y - ring.y) > 0.2 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      if (!frame) frame = requestAnimationFrame(tick);
      setVisible(true);

      const element = event.target instanceof Element ? event.target : null;
      if (element?.closest("input, textarea, select")) {
        setMode("text");
        return;
      }
      const interactive = element?.closest<HTMLElement>(INTERACTIVE);
      const cursorLabel = interactive?.dataset.cursor;
      if (cursorLabel) {
        setMode("label");
        setLabel(cursorLabel);
      } else {
        setMode(interactive ? "link" : "default");
      }
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const size = RING_SIZE[mode];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <div ref={ringRef} className="absolute top-0 left-0 will-change-transform">
        <div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-glow/60 mix-blend-screen transition-[width,height,opacity,background-color,scale] duration-300 ease-out"
          style={{
            width: size,
            height: size,
            opacity: visible ? 1 : 0,
            scale: pressed ? "0.8" : "1",
            backgroundColor: RING_FILL[mode],
          }}
        >
          {mode === "label" ? (
            <span className="font-mono text-[10px] font-semibold tracking-wider text-white uppercase">{label}</span>
          ) : null}
        </div>
      </div>
      <div ref={dotRef} className="absolute top-0 left-0 will-change-transform">
        <div
          className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-glow shadow-[0_0_12px_rgb(34_211_238)] transition-opacity duration-200"
          style={{ opacity: visible && mode !== "label" && mode !== "text" ? 1 : 0 }}
        />
      </div>
    </div>
  );
}
