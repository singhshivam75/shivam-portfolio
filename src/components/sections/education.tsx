import type { EducationItem } from "@/types/content";
import { CapIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface EducationProps {
  index: number;
  items: readonly EducationItem[];
}

function Emblem() {
  return (
    <div aria-hidden="true" className="relative grid size-36 shrink-0 place-items-center sm:size-44">
      <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-violet-glow/30" />
      <div className="absolute inset-4 animate-spin-reverse rounded-full border border-cyan-glow/20" />
      <div className="absolute inset-4 bg-[radial-gradient(closest-side,rgb(139_92_246/0.3),transparent)]" />
      <div className="relative grid size-20 animate-float place-items-center rounded-3xl bg-gradient-to-br from-violet-glow to-cyan-glow text-midnight-950 shadow-[0_20px_60px_-10px_rgb(139_92_246/0.8)] sm:size-24">
        <CapIcon width={44} height={44} strokeWidth={1.6} />
      </div>
    </div>
  );
}

export function Education({ index, items }: EducationProps) {
  return (
    <Section id="education" index={index} eyebrow="Education" title="Foundations.">
      <ul className={`grid gap-6 ${items.length > 1 ? "lg:grid-cols-2" : ""}`}>
        {items.map((item, i) => (
          <li key={`${item.institution}-${item.degree}`}>
            <Reveal delay={0.08 * i}>
              <SpotlightCard glowBorder className="overflow-hidden p-8 sm:p-12">
                <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-center">
                  <Emblem />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs tracking-[0.3em] text-cyan-glow uppercase">{item.period}</p>
                    <h3 className="mt-4 font-display text-3xl leading-tight font-semibold text-white sm:text-4xl">
                      {item.degree}
                    </h3>
                    <p className="mt-3 text-xl text-violet-200">
                      {item.institution}
                      {item.location ? <span className="text-ink-muted"> · {item.location}</span> : null}
                    </p>
                    {item.details.length > 0 ? (
                      <ul className="mt-6 space-y-2">
                        {item.details.map((detail) => (
                          <li key={detail} className="flex gap-3 text-ink-muted">
                            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-violet-glow" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
