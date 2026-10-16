import type { Achievement } from "@/types/content";
import { ArrowUpRightIcon, TrophyIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface AchievementsProps {
  index: number;
  items: readonly Achievement[];
}

export function Achievements({ index, items }: AchievementsProps) {
  return (
    <Section id="achievements" index={index} eyebrow="Achievements" title="Milestones.">
      <ul className="grid gap-5 sm:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.title}>
            <Reveal delay={0.06 * i} className="h-full">
              <SpotlightCard className="flex h-full gap-5 p-7">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-glow/30 to-cyan-glow/20 text-cyan-glow ring-1 ring-white/10">
                  <TrophyIcon />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-cyan-glow">
                        {item.title}
                        <ArrowUpRightIcon width={16} height={16} />
                      </a>
                    ) : (
                      item.title
                    )}
                  </h3>
                  {item.date ? <p className="mt-1 font-mono text-xs text-violet-200">{item.date}</p> : null}
                  {item.description ? <p className="mt-2 text-ink-muted">{item.description}</p> : null}
                </div>
              </SpotlightCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
