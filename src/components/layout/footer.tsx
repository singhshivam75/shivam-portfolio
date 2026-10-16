import type { ResumeLink } from "@/lib/resume";
import type { NavItem } from "@/lib/sections";
import type { Profile } from "@/types/content";
import { ArrowUpIcon, DownloadIcon } from "@/components/ui/icons";
import { SocialLinks } from "@/components/ui/social-links";

interface FooterProps {
  profile: Profile;
  items: readonly NavItem[];
  resume: ResumeLink | null;
}

export function Footer({ profile, items, resume }: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 pt-20 pb-10">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(139_92_246/0.12),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-cyan-glow uppercase">{profile.role}</p>
            <p className="mt-4 font-display text-5xl leading-none font-bold tracking-tighter text-white sm:text-7xl">
              {profile.name}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="text-lg text-ink-muted underline decoration-white/20 underline-offset-8 transition hover:text-white hover:decoration-cyan-glow"
              >
                {profile.email}
              </a>
              {resume ? (
                <a
                  href={resume.href}
                  download={resume.fileName}
                  type="application/pdf"
                  data-cursor="Download"
                  className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-cyan-glow/40 hover:text-white"
                >
                  <DownloadIcon width={15} height={15} />
                  Download Resume
                  <span className="sr-only">(PDF)</span>
                </a>
              ) : null}
            </div>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
              {items.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-sm text-ink-muted transition hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-sm text-ink-muted">
            Designed and built by <span className="text-white">{profile.name}</span>.
          </p>
          <div className="flex items-center gap-3">
            <SocialLinks profile={profile} />
            <a
              href="#top"
              aria-label="Back to top"
              className="glass grid size-11 place-items-center rounded-xl text-ink-muted transition hover:-translate-y-0.5 hover:text-cyan-glow"
            >
              <ArrowUpIcon width={18} height={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
