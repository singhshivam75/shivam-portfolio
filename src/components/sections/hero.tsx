import type { CSSProperties, ReactNode } from "react";
import type { ResumeLink } from "@/lib/resume";
import type { Profile } from "@/types/content";
import { HeroVisual } from "@/components/three/hero-visual";
import { ButtonLink } from "@/components/ui/button-link";
import { ArrowDownIcon, ArrowUpRightIcon, DownloadIcon } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/magnetic";
import { RotatingWords } from "@/components/ui/rotating-words";
import { SocialLinks } from "@/components/ui/social-links";

/** CSS-only entrance so the hero paints with the first frame, before any JavaScript runs. */
function HeroIn({ delay = 0, className = "", children }: { delay?: number; className?: string; children: ReactNode }) {
  return (
    <div className={`hero-in ${className}`} style={{ "--d": `${delay * 1000}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

interface HeroProps {
  profile: Profile;
  showProjectsCta: boolean;
  nextSectionId: string;
  currentCompany: string | null;
  resume: ResumeLink | null;
}

export function Hero({ profile, showProjectsCta, nextSectionId, currentCompany, resume }: HeroProps) {
  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");
  const buildWords = profile.focusAreas.map((area) => area.title);
  const quickStats = profile.stats.slice(0, 3);

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-20 pb-16"
    >
      <HeroVisual />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-midnight-950 via-midnight-950/75 to-transparent lg:from-midnight-950/95 lg:via-midnight-950/45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-midnight-950 via-midnight-950/70 to-transparent"
      />

      <div className="hero-drift pointer-events-none relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
          {currentCompany ? (
            <HeroIn>
              <p className="glass mb-8 inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-2 text-xs text-cyan-100">
                <span className="relative flex size-5 items-center justify-center rounded-full bg-cyan-glow/15">
                  <span className="absolute inline-flex size-2.5 animate-ping rounded-full bg-cyan-glow opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-cyan-glow" />
                </span>
                <span>
                  {profile.role} at <span className="font-semibold text-white">{currentCompany}</span>
                </span>
              </p>
            </HeroIn>
          ) : null}

          <h1 id="hero-heading" className="font-display font-bold tracking-tighter text-white">
            <HeroIn delay={0.05}>
              <span className="block text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.88]">{firstName}</span>
            </HeroIn>
            <HeroIn delay={0.14}>
              <span className="block pb-[0.1em] text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.95] text-gradient">{lastName}</span>
            </HeroIn>
          </h1>

          <HeroIn delay={0.24}>
            <p className="mt-7 flex flex-wrap items-baseline gap-x-3 font-display text-2xl text-ink-muted sm:text-3xl">
              <span>I build</span>
              {buildWords.length > 0 ? (
                <RotatingWords words={buildWords} className="font-semibold text-white" />
              ) : (
                <span className="font-semibold text-white">{profile.role}</span>
              )}
            </p>
          </HeroIn>

          {profile.tagline ? (
            <HeroIn delay={0.32}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">{profile.tagline}</p>
            </HeroIn>
          ) : null}

          <HeroIn delay={0.4} className="mt-10 flex flex-wrap items-center gap-4">
            {showProjectsCta ? (
              <Magnetic>
                <ButtonLink href="#projects" data-cursor="Explore">
                  View my work
                  <ArrowUpRightIcon width={16} height={16} />
                </ButtonLink>
              </Magnetic>
            ) : null}
            <Magnetic>
              <ButtonLink href="#contact" variant={showProjectsCta ? "ghost" : "primary"}>
                Get in touch
              </ButtonLink>
            </Magnetic>
            {resume ? (
              <Magnetic>
                <ButtonLink
                  href={resume.href}
                  variant="ghost"
                  download={resume.fileName}
                  type="application/pdf"
                  data-cursor="Download"
                >
                  <DownloadIcon width={16} height={16} />
                  Download Resume
                  <span className="sr-only">(PDF)</span>
                </ButtonLink>
              </Magnetic>
            ) : null}
          </HeroIn>

          <HeroIn delay={0.5} className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
            {quickStats.length > 0 ? (
              <dl className="flex gap-8">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <dt className="order-2 mt-1 max-w-[7rem] text-xs leading-snug text-ink-muted">{stat.label}</dt>
                    <dd className="order-1 font-display text-3xl font-bold text-white">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <span aria-hidden="true" className="hidden h-10 w-px bg-white/10 sm:block" />
            <SocialLinks profile={profile} />
          </HeroIn>
        </div>
      </div>

      <a
        href={`#${nextSectionId}`}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-xs text-ink-muted transition hover:text-white md:flex"
        aria-label="Scroll to next section"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border border-white/20 pt-2">
          <ArrowDownIcon className="animate-bounce" width={12} height={12} />
        </span>
      </a>
    </section>
  );
}
