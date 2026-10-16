"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { LabScene, LabSceneKind } from "@/types/ai-lab";
import { CloseIcon } from "@/components/ui/icons";
import { useCanRender3D } from "@/lib/use-can-render-3d";
import { LabFallback } from "./lab-fallback";

const LabCanvas = dynamic(() => import("./lab-canvas"), { ssr: false, loading: () => null });

const KIND: Record<LabSceneKind, { label: string; className: string }> = {
  resume: { label: "From my resume", className: "bg-cyan-glow/10 text-cyan-200 ring-cyan-glow/40" },
  concept: { label: "Concept demo · not a deployed project", className: "bg-violet-glow/15 text-violet-200 ring-violet-glow/40" },
  shipped: { label: "Shipped project patterns", className: "bg-emerald-400/10 text-emerald-200 ring-emerald-400/35" },
};

interface LabStageProps {
  scenes: readonly LabScene[];
}

export function LabStage({ scenes }: LabStageProps) {
  const baseId = useId();
  const canRender3D = useCanRender3D();
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = stageRef.current;
    if (!node || !canRender3D) return;
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true);
          nearObserver.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );
    const viewObserver = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), {
      threshold: 0.05,
    });
    nearObserver.observe(node);
    viewObserver.observe(node);
    return () => {
      nearObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [canRender3D]);

  const scene = scenes[sceneIndex] ?? scenes[0];
  const labels = useMemo(
    () => Object.fromEntries((scene?.hotspots ?? []).map((hotspot) => [hotspot.id, hotspot.label])),
    [scene],
  );

  if (!scene) return null;

  const show3D = canRender3D && near;
  const hotspot = scene.hotspots.find((item) => item.id === selected) ?? null;
  const kind = KIND[scene.kind];
  const panelId = `${baseId}-panel`;

  const selectScene = (index: number) => {
    setSceneIndex(index);
    setSelected(null);
  };
  const toggle = (id: string) => setSelected((current) => (current === id ? null : id));

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = scenes.length - 1;
    const next = { ArrowRight: sceneIndex === last ? 0 : sceneIndex + 1, ArrowLeft: sceneIndex === 0 ? last : sceneIndex - 1, Home: 0, End: last }[
      event.key
    ];
    if (next === undefined) return;
    event.preventDefault();
    selectScene(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="AI lab scenes"
        className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
      >
        {scenes.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            id={`${baseId}-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={i === sceneIndex}
            aria-controls={panelId}
            tabIndex={i === sceneIndex ? 0 : -1}
            onClick={() => selectScene(i)}
            onKeyDown={onTabKeyDown}
            className={`group flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition duration-300 ${
              i === sceneIndex
                ? "border-cyan-glow/50 bg-gradient-to-br from-violet-glow/25 to-cyan-glow/10 text-white shadow-[0_0_30px_-12px_rgb(34_211_238/0.7)]"
                : "border-white/10 bg-midnight-900/50 text-ink-muted hover:border-violet-glow/40 hover:text-white"
            }`}
          >
            <span className="font-mono text-[11px] text-cyan-glow/80">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={`${baseId}-tab-${scene.id}`}>
        <div className="relative">
          <div
            ref={stageRef}
            className="relative h-[460px] overflow-hidden rounded-3xl border border-white/10 bg-[#03051a] shadow-[0_40px_120px_-40px_rgb(139_92_246/0.45)] sm:h-[440px] lg:h-[600px]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgb(139_92_246/0.22),transparent_60%),radial-gradient(ellipse_at_80%_90%,rgb(34_211_238/0.14),transparent_55%)]"
            />
            <div
              key={scene.id}
              className={`pop-in absolute inset-x-0 top-14 bottom-4 px-2 transition-opacity duration-700 sm:top-12 ${
                show3D && ready ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <LabFallback sceneId={scene.id} hotspots={scene.hotspots} selected={selected} onSelect={toggle} />
            </div>
            {show3D ? (
              <div
                aria-hidden="true"
                className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
              >
                <LabCanvas
                  sceneIndex={sceneIndex}
                  selected={selected}
                  labels={labels}
                  active={inView}
                  onSelect={toggle}
                  onClear={() => setSelected(null)}
                  onReady={() => setReady(true)}
                />
              </div>
            ) : null}

            <div className="pointer-events-none absolute inset-x-4 top-4 flex flex-wrap items-start justify-between gap-2 sm:inset-x-6 sm:top-5">
              <div className="flex flex-col gap-1.5">
                <span className={`w-fit rounded-full px-3 py-1 font-mono text-[10px] tracking-widest uppercase ring-1 backdrop-blur-sm ${kind.className}`}>
                  {kind.label}
                </span>
                <p className="hidden text-sm text-ink-muted sm:block">{scene.tagline}</p>
              </div>
              <span className="hidden items-center gap-2 rounded-full bg-midnight-950/60 px-3 py-1 font-mono text-[10px] tracking-widest text-ink-muted uppercase ring-1 ring-white/10 sm:flex">
                <span className="size-1.5 animate-pulse rounded-full bg-cyan-glow" aria-hidden="true" />
                {show3D ? "Move · click a glowing node" : "Tap a node"}
              </span>
            </div>
          </div>

          <div aria-live="polite" className="md:pointer-events-none md:absolute md:bottom-5 md:left-5 md:z-20 md:max-w-sm">
            {hotspot ? (
              <div key={hotspot.id} className="glass pop-in pointer-events-auto mt-4 rounded-2xl p-5 md:mt-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-lg font-semibold text-white">{hotspot.label}</h3>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    aria-label={`Close ${hotspot.label} details`}
                    className="-m-1 rounded-full p-1 text-ink-muted transition hover:text-white"
                  >
                    <CloseIcon width={16} height={16} />
                  </button>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{hotspot.detail}</p>
                {hotspot.skills?.length || hotspot.sources?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={hotspot.sources?.length ? "Used in" : "Resume skills"}>
                    {(hotspot.skills ?? []).map((skill) => (
                      <li key={skill} className="rounded-full bg-violet-glow/15 px-2.5 py-0.5 text-[11px] text-violet-100 ring-1 ring-violet-glow/30">
                        {skill}
                      </li>
                    ))}
                    {(hotspot.sources ?? []).map((source) => (
                      <li key={source} className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[11px] text-emerald-200 ring-1 ring-emerald-400/30">
                        {source}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <ul aria-label={`${scene.label} nodes`} className="mt-4 flex flex-wrap gap-2">
          {scene.hotspots.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={selected === item.id}
                onClick={() => toggle(item.id)}
                className={`rounded-full border px-3.5 py-1.5 text-xs transition duration-300 ${
                  selected === item.id
                    ? "border-cyan-glow/60 bg-cyan-glow/15 text-white"
                    : "border-white/10 bg-white/[0.03] text-ink-muted hover:border-violet-glow/40 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
