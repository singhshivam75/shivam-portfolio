import type { EducationItem, Profile } from "@/types/content";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { getFocusIcon } from "@/components/ui/category-icon";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { TiltCard } from "@/components/ui/tilt-card";

interface AboutProps {
  index: number;
  profile: Profile;
  currentCompany: string | null;
  education: EducationItem | null;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

function ProfileCard({ profile, currentCompany, education }: Omit<AboutProps, "index">) {
  const githubHandle = profile.links.github.split("/").filter(Boolean).pop() ?? "";
  const rows: Array<[string, string]> = [
    ["role", profile.role],
    ...(currentCompany ? ([["company", currentCompany]] as Array<[string, string]>) : []),
    ...(education ? ([["education", `${education.degree.replace(/\s*\(.*\)/, "")}, ${education.institution}`]] as Array<[string, string]>) : []),
    ["github", `@${githubHandle}`],
  ];

  return (
    <TiltCard className="border-glow p-7 sm:p-8">
      <div className="[transform:translateZ(40px)]">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute -inset-1.5 animate-spin-slow rounded-2xl bg-[conic-gradient(from_0deg,#8b5cf6,#22d3ee,#8b5cf6)] opacity-70 blur-md" />
            <div className="relative grid size-20 place-items-center rounded-2xl bg-midnight-900 font-display text-2xl font-bold">
              <span className="text-gradient">{initials(profile.name)}</span>
            </div>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-white">{profile.name}</p>
            <p className="mt-1 font-mono text-xs tracking-widest text-cyan-glow uppercase">{profile.role}</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/8 bg-midnight-950/60 p-5 font-mono text-[13px] leading-7">
          <p className="text-ink-muted">
            <span className="text-violet-300">const</span> <span className="text-white">me</span> = {"{"}
          </p>
          {rows.map(([key, value]) => (
            <p key={key} className="truncate pl-5 text-ink-muted">
              <span className="text-cyan-200">{key}</span>: <span className="text-emerald-200">&quot;{value}&quot;</span>,
            </p>
          ))}
          <p className="text-ink-muted">{"};"}</p>
        </div>
      </div>
    </TiltCard>
  );
}

export function About({ index, profile, currentCompany, education }: AboutProps) {
  const [lead, ...paragraphs] = profile.summary;

  return (
    <Section id="about" index={index} eyebrow="About" title="Engineering products that scale and ship.">
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28">
          <ProfileCard profile={profile} currentCompany={currentCompany} education={education} />
        </Reveal>

        <div>
          {lead ? (
            <Reveal>
              <p className="font-display text-2xl leading-snug text-white sm:text-3xl">{lead}</p>
            </Reveal>
          ) : null}
          {paragraphs.map((paragraph, i) => (
            <Reveal key={paragraph} delay={0.08 * (i + 1)}>
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">{paragraph}</p>
            </Reveal>
          ))}

          {profile.focusAreas.length > 0 ? (
            <ul className="mt-12 grid gap-4 sm:grid-cols-2">
              {profile.focusAreas.map((area, i) => {
                const Icon = getFocusIcon(area.icon);
                return (
                  <li key={area.title}>
                    <Reveal delay={0.06 * i} className="h-full">
                      <SpotlightCard className="h-full p-6">
                        <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-violet-glow/25 to-cyan-glow/15 text-cyan-glow ring-1 ring-white/10 transition duration-500 group-hover:scale-110 group-hover:rotate-6">
                          <Icon />
                        </span>
                        <h3 className="mt-5 font-display text-lg font-semibold text-white">{area.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{area.description}</p>
                      </SpotlightCard>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {profile.stats.length > 0 ? (
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/8 sm:grid-cols-4">
              {profile.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col bg-midnight-900/90 p-5 sm:p-6">
                  <dt className="order-2 mt-2 text-xs leading-snug text-ink-muted">{stat.label}</dt>
                  <dd className="order-1 font-display text-[clamp(1.5rem,2.1vw,2rem)] font-bold whitespace-nowrap text-gradient">
                    <AnimatedCounter value={stat.value} />
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
