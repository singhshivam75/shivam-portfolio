import type { SkillGroup } from "@/types/content";
import { getSkillIcon } from "@/components/ui/category-icon";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { StaggerChips } from "@/components/ui/stagger-chips";
import { TechOrbit } from "@/components/ui/tech-orbit";

interface SkillsProps {
  index: number;
  groups: readonly SkillGroup[];
  featuredStack: readonly string[];
  role: string;
}

export function Skills({ index, groups, featuredStack, role }: SkillsProps) {
  const visible = groups.filter((group) => group.skills.length > 0);
  const total = visible.reduce((sum, group) => sum + group.skills.length, 0);

  return (
    <Section id="skills" index={index} eyebrow="Skills" title="A full-stack toolkit, end to end.">
      <div className="mb-16 grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <TechOrbit items={featuredStack} centerLabel={role} />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-display text-2xl leading-snug text-white sm:text-3xl">
            From pixel-perfect interfaces to queues, caches and cloud infrastructure.
          </p>
          <dl className="mt-8 flex gap-10">
            <div className="flex flex-col">
              <dt className="order-2 text-sm text-ink-muted">Technologies</dt>
              <dd className="order-1 font-display text-5xl font-bold text-gradient">{total}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="order-2 text-sm text-ink-muted">Categories</dt>
              <dd className="order-1 font-display text-5xl font-bold text-gradient">{visible.length}</dd>
            </div>
          </dl>
        </Reveal>
      </div>

      <ul className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((group, i) => {
          const Icon = getSkillIcon(group.title);
          return (
            <li key={group.title}>
              <Reveal delay={0.04 * i} className="h-full">
                <SpotlightCard className="flex h-full flex-col p-6 sm:p-7">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-glow/25 to-cyan-glow/15 text-cyan-glow ring-1 ring-white/10 transition duration-500 group-hover:scale-110 group-hover:-rotate-6">
                        <Icon width={18} height={18} />
                      </span>
                      <h3 className="font-display text-lg font-semibold text-white">{group.title}</h3>
                    </div>
                    <span className="font-mono text-xs text-ink-muted">
                      {String(group.skills.length).padStart(2, "0")}
                    </span>
                  </div>
                  <StaggerChips items={group.skills} label={`${group.title} skills`} />
                </SpotlightCard>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
