import type { Project } from "@/types/content";
import { ProjectCover } from "@/components/projects/project-cover";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";

interface ProjectsProps {
  index: number;
  projects: readonly Project[];
}

function ProjectRow({ project, position }: { project: Project; position: number }) {
  const { github, live } = project.links;
  const flipped = position % 2 === 1;

  return (
    <article
      aria-labelledby={`project-${position}-title`}
      className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14"
    >
      <Reveal className={`lg:col-span-7 ${flipped ? "lg:order-2" : ""}`} y={50}>
        <ProjectCover
          visual={project.visual}
          accent={project.accent}
          title={project.title}
          preview={project.preview}
          liveUrl={live}
        />
      </Reveal>

      <div className={`lg:col-span-5 ${flipped ? "lg:order-1" : ""}`}>
        <Reveal delay={0.1}>
          <div className="flex items-center gap-4 font-mono text-xs tracking-[0.25em] uppercase">
            <span className="text-gradient font-semibold">{String(position + 1).padStart(2, "0")}</span>
            <span aria-hidden="true" className="h-px w-8 bg-white/20" />
            <span className="text-cyan-glow">{project.category}</span>
          </div>
          <h3
            id={`project-${position}-title`}
            className="mt-4 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl"
          >
            {project.title}
          </h3>
          <p className="mt-5 text-lg leading-relaxed text-ink">{project.description}</p>
        </Reveal>

        {project.highlights.length > 0 ? (
          <Reveal delay={0.18}>
            <ul className="mt-6 space-y-3">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-[15px] leading-relaxed text-ink-muted">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full"
                    style={{ background: project.accent[1] }}
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        <Reveal delay={0.24}>
          <ul aria-label={`${project.title} technologies`} className="mt-7 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <li
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-ink transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
              >
                <span aria-hidden="true" className="size-1 rounded-full" style={{ background: project.accent[0] }} />
                {tech}
              </li>
            ))}
          </ul>

          {github || live ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {live ? (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  data-cursor="Visit"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow px-6 py-3 text-sm font-semibold text-midnight-950 shadow-[0_10px_40px_-12px_rgb(139_92_246/0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-10px_rgb(34_211_238/0.7)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition duration-700 group-hover:translate-x-full"
                  />
                  <span aria-hidden="true" className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-midnight-950/50" />
                    <span className="relative inline-flex size-2 rounded-full bg-midnight-950" />
                  </span>
                  <span className="relative">Live Demo</span>
                  <ArrowUpRightIcon
                    width={16}
                    height={16}
                    className="relative transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                  <span className="sr-only">: {project.title} (opens in a new tab)</span>
                </a>
              ) : null}
              {github ? (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  <GitHubIcon width={16} height={16} />
                  Source code
                </a>
              ) : null}
              {live ? <span className="font-mono text-xs text-ink-muted">{new URL(live).host}</span> : null}
            </div>
          ) : null}
        </Reveal>
      </div>
    </article>
  );
}

export function Projects({ index, projects }: ProjectsProps) {
  return (
    <Section
      id="projects"
      index={index}
      eyebrow="Projects"
      title="Selected work."
      description="Marketplaces, real estate, education and hiring platforms built across web, mobile and backend."
    >
      <div className="space-y-28 sm:space-y-36">
        {projects.map((project, position) => (
          <ProjectRow key={project.title} project={project} position={position} />
        ))}
      </div>
    </Section>
  );
}
