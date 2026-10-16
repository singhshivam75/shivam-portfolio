"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useCanRender3D } from "@/lib/use-can-render-3d";
import { StaticWorkspace } from "./static-workspace";

const WorkspaceScene = dynamic(() => import("./workspace-scene"), {
  ssr: false,
  loading: () => null,
});

export function HeroVisual() {
  const canRender3D = useCanRender3D();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), {
      threshold: 0.02,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      {canRender3D ? (
        <>
          <div
            className={`absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgb(139_92_246/0.25),transparent_55%)] transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`}
          />
          <div className={`absolute inset-0 transition-opacity duration-[1400ms] ${ready ? "opacity-100" : "opacity-0"}`}>
            <WorkspaceScene active={inView} onReady={() => setReady(true)} />
          </div>
          <p
            className={`pointer-events-none absolute right-8 bottom-10 hidden items-center gap-2 font-mono text-[11px] tracking-widest text-ink-muted uppercase transition-opacity delay-1000 duration-1000 lg:flex ${ready ? "opacity-100" : "opacity-0"}`}
          >
            <span className="size-1.5 animate-pulse rounded-full bg-cyan-glow" />
            Hover the floating tech
          </p>
        </>
      ) : (
        <StaticWorkspace />
      )}
    </div>
  );
}
