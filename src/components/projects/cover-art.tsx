import { useId, type ReactNode } from "react";
import type { ProjectVisual } from "@/types/content";

/* Abstract, original UI illustrations. They intentionally avoid depicting any real product screen. */

function Bar({ className = "" }: { className?: string }) {
  return <span className={`block h-2 rounded-full bg-white/15 ${className}`} />;
}

function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-midnight-900/90 shadow-2xl shadow-black/60">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
        <span className="size-2 rounded-full bg-red-400/80" />
        <span className="size-2 rounded-full bg-amber-300/80" />
        <span className="size-2 rounded-full bg-emerald-400/80" />
        <span className="ml-3 h-3 flex-1 rounded-full bg-white/5" />
      </div>
      <div className="flex-1 p-3">{children}</div>
    </div>
  );
}

function House() {
  const id = useId();
  return (
    <svg viewBox="0 0 64 40" className="h-full w-full" aria-hidden="true">
      <rect width="64" height="40" fill={`url(#${id})`} />
      <path d="M14 30V19l10-8 10 8v11Z" fill="rgb(255 255 255 / 0.85)" />
      <path d="M34 30V22l8-6 8 6v8Z" fill="rgb(255 255 255 / 0.6)" />
      <rect x="21" y="23" width="5" height="7" fill="var(--a)" />
      <rect y="30" width="64" height="10" fill="rgb(0 0 0 / 0.25)" />
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--a)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--b)" stopOpacity="0.7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ListingArt() {
  return (
    <BrowserFrame>
      <div className="mb-3 flex items-center gap-2">
        <span className="h-6 flex-1 rounded-lg border border-white/10 bg-white/5" />
        <span className="h-6 w-14 rounded-lg bg-[var(--a)]" />
      </div>
      <div className="mb-3 flex gap-1.5">
        {["w-10", "w-14", "w-8", "w-12"].map((w, i) => (
          <span key={w} className={`h-4 ${w} rounded-full ${i === 0 ? "bg-[var(--b)]/60" : "bg-white/10"}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-white/5 bg-white/[0.03]">
            <div className="aspect-[16/10]">
              <House />
            </div>
            <div className="space-y-1.5 p-2">
              <Bar className="w-3/4" />
              <Bar className="w-1/2 bg-[var(--a)]/50" />
            </div>
          </div>
        ))}
      </div>
    </BrowserFrame>
  );
}

export function DashboardArt() {
  const areaId = useId();
  return (
    <BrowserFrame>
      <div className="flex h-full gap-3">
        <div className="hidden w-16 shrink-0 space-y-2 rounded-lg bg-white/[0.03] p-2 sm:block">
          <span className="mb-3 block size-6 rounded-md bg-gradient-to-br from-[var(--a)] to-[var(--b)]" />
          {Array.from({ length: 5 }, (_, i) => (
            <Bar key={i} className={i === 1 ? "bg-[var(--a)]/60" : ""} />
          ))}
        </div>
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[0.9, 0.6, 0.75].map((w, i) => (
              <div key={i} className="rounded-lg border border-white/5 bg-white/[0.03] p-2">
                <Bar className="w-1/2" />
                <span className="mt-2 block h-4 rounded bg-gradient-to-r from-[var(--a)] to-[var(--b)]" style={{ width: `${w * 100}%` }} />
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2">
            <svg viewBox="0 0 200 60" className="h-20 w-full" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id={areaId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--a)" stopOpacity="0.5" />
                  <stop offset="1" stopColor="var(--a)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 50 C30 40 40 20 70 28 S120 10 140 18 S180 6 200 8 V60 H0Z" fill={`url(#${areaId})`} />
              <path d="M0 50 C30 40 40 20 70 28 S120 10 140 18 S180 6 200 8" fill="none" stroke="var(--b)" strokeWidth="2" />
            </svg>
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md bg-white/[0.03] p-1.5">
                <span className="size-3 rounded-full bg-[var(--b)]/70" />
                <Bar className="w-1/3" />
                <Bar className="ml-auto w-10 bg-[var(--a)]/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

export function KanbanArt() {
  const columns = [3, 2, 3, 1];
  return (
    <BrowserFrame>
      <div className="mb-3 flex items-center justify-between">
        <Bar className="w-24" />
        <div className="flex -space-x-1.5">
          {["var(--a)", "var(--b)", "#f472b6"].map((color) => (
            <span key={color} className="size-5 rounded-full ring-2 ring-midnight-900" style={{ background: color }} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {columns.map((count, col) => (
          <div key={col} className="space-y-2 rounded-lg bg-white/[0.03] p-1.5">
            <span className="block h-1.5 w-1/2 rounded-full" style={{ background: col % 2 ? "var(--b)" : "var(--a)" }} />
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="space-y-1.5 rounded-md border border-white/5 bg-midnight-800/80 p-1.5">
                <Bar className="w-full" />
                <Bar className="w-2/3" />
                <span className="block size-3 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </BrowserFrame>
  );
}

function Phone({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`aspect-[9/18] h-[86%] rounded-[1.6rem] border border-white/15 bg-midnight-950 p-1.5 shadow-2xl shadow-black/70 ${className}`}>
      <div className="relative h-full overflow-hidden rounded-[1.25rem] bg-midnight-900">
        <span className="absolute top-1.5 left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-black" />
        <div className="h-full p-2.5 pt-5">{children}</div>
      </div>
    </div>
  );
}

export function MobileArt() {
  return (
    <div className="flex h-full items-center justify-center gap-[6%]">
      <Phone className="translate-y-[4%] -rotate-6">
        <div className="mb-2 h-16 rounded-xl bg-gradient-to-br from-[var(--a)] to-[var(--b)]" />
        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-white/[0.04] p-1.5">
              <span className="size-5 shrink-0 rounded-md bg-white/15" />
              <div className="flex-1 space-y-1">
                <Bar className="w-3/4" />
                <Bar className="h-1.5 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Phone>
      <Phone className="-translate-y-[4%] rotate-6">
        <div className="space-y-2">
          <Bar className="w-1/2" />
          <div className="aspect-square rounded-xl border border-white/10 bg-[radial-gradient(circle_at_30%_30%,var(--a),transparent_70%)]" />
          <Bar className="w-full" />
          <Bar className="w-2/3" />
          <span className="mt-3 block h-6 rounded-lg bg-[var(--b)]" />
        </div>
      </Phone>
    </div>
  );
}

export function CoverArt({ visual }: { visual: ProjectVisual }) {
  switch (visual) {
    case "listing":
      return <ListingArt />;
    case "dashboard":
      return <DashboardArt />;
    case "kanban":
      return <KanbanArt />;
    case "mobile":
      return <MobileArt />;
  }
}
