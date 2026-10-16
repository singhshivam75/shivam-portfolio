import type { ReactNode } from "react";
import type { SectionId } from "@/lib/sections";
import { Reveal } from "./reveal";
import { SplitText } from "./split-text";

interface SectionProps {
  id: SectionId;
  index: number;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  children: ReactNode;
}

export function Section({ id, index, eyebrow, title, description, align = "left", children }: SectionProps) {
  const headingId = `${id}-heading`;
  const centered = align === "center";

  return (
    <section id={id} aria-labelledby={headingId} className="defer-render relative overflow-x-clip py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className={`mb-16 sm:mb-20 ${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
          <Reveal>
            <p className={`mb-5 flex items-center gap-3 font-mono text-xs tracking-[0.35em] text-cyan-glow uppercase ${centered ? "justify-center" : ""}`}>
              <span className="text-ink-muted">{String(index).padStart(2, "0")}</span>
              <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-cyan-glow to-transparent" />
              {eyebrow}
            </p>
          </Reveal>
          <h2
            id={headingId}
            className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-6xl"
          >
            <SplitText text={title} />
          </h2>
          {description ? (
            <Reveal delay={0.15}>
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">{description}</p>
            </Reveal>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
