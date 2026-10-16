import type { CSSProperties } from "react";
import type { ExperienceItem } from "@/types/content";
import { BriefcaseIcon, MapPinIcon } from "@/components/ui/icons";
import { SpotlightCard } from "@/components/ui/spotlight-card";

function monogram(company: string): string {
  return company
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}

function TimelineCard({ item, index }: { item: ExperienceItem; index: number }) {
  const current = /present/i.test(item.period);
  return (
    <SpotlightCard glowBorder={current} className="p-6 sm:p-8">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-4 right-6 font-display text-7xl font-bold text-white/[0.04] select-none"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex items-start gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-glow/30 to-cyan-glow/20 font-display text-lg font-bold text-white ring-1 ring-white/10">
          {monogram(item.company)}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">{item.company}</h3>
            {current ? (
              <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-300 uppercase ring-1 ring-emerald-400/30">
                Current
              </span>
            ) : null}
          </div>
          <p className="mt-1 flex items-center gap-2 text-violet-200">
            <BriefcaseIcon width={15} height={15} />
            {item.role}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-muted">
            <span>{item.period}</span>
            {item.location ? (
              <span className="inline-flex items-center gap-1">
                <MapPinIcon width={13} height={13} />
                {item.location}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {item.summary ? <p className="mt-6 leading-relaxed text-ink">{item.summary}</p> : null}

      {item.highlights.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {item.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 text-[15px] leading-relaxed text-ink-muted">
              <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-gradient-to-r from-violet-glow to-cyan-glow" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {item.tech.length > 0 ? (
        <ul aria-label={`Technologies used at ${item.company}`} className="mt-6 flex flex-wrap gap-2">
          {item.tech.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-cyan-glow/20 bg-cyan-glow/[0.06] px-3 py-1 font-mono text-[11px] text-cyan-100"
            >
              {tech}
            </li>
          ))}
        </ul>
      ) : null}
    </SpotlightCard>
  );
}

export function ExperienceTimeline({ items }: { items: readonly ExperienceItem[] }) {
  return (
    <ol className="relative">
      <div aria-hidden="true" className="absolute top-0 bottom-0 left-[19px] w-px bg-white/10 md:left-1/2 md:-translate-x-1/2">
        <div className="timeline-line absolute inset-0 origin-top bg-gradient-to-b from-violet-glow via-cyan-glow to-violet-glow shadow-[0_0_14px_rgb(34_211_238/0.8)]" />
      </div>

      {items.map((item, index) => {
        const right = index % 2 === 1;
        return (
          <li key={`${item.company}-${item.period}`} className="relative pb-14 pl-14 last:pb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
            <span
              aria-hidden="true"
              data-reveal="pop"
              className="absolute top-8 left-[19px] z-10 grid size-5 -translate-x-1/2 place-items-center rounded-full border border-cyan-glow/60 bg-midnight-950 md:left-1/2"
            >
              <span className="size-2 rounded-full bg-cyan-glow shadow-[0_0_14px_rgb(34_211_238)]" />
            </span>

            <div
              data-reveal="side"
              className={right ? "md:col-start-2" : "md:col-start-1"}
              style={{ "--reveal-x": right ? "60px" : "-60px" } as CSSProperties}
            >
              <TimelineCard item={item} index={index} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
