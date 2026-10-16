import type { Profile } from "@/types/content";
import { ContactForm } from "@/components/contact/contact-form";
import { CopyEmail } from "@/components/contact/copy-email";
import { ArrowUpRightIcon, GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface ContactProps {
  index: number;
  profile: Profile;
}

export function Contact({ index, profile }: ContactProps) {
  const channels = [
    { label: "LinkedIn", value: "Connect with me", href: profile.links.linkedin, Icon: LinkedInIcon },
    {
      label: "GitHub",
      value: `@${profile.links.github.split("/").filter(Boolean).pop() ?? ""}`,
      href: profile.links.github,
      Icon: GitHubIcon,
    },
  ];

  return (
    <Section
      id="contact"
      index={index}
      eyebrow="Contact"
      title="Let's build something remarkable."
      description="Have a role, project or idea in mind? Send a message and I'll get back to you."
    >
      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 left-1/4 size-[36rem] -translate-x-1/4 -translate-y-1/4 bg-[radial-gradient(closest-side,rgb(139_92_246/0.15),transparent)]" />
        <div className="relative grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col gap-4">
            <Reveal>
              <CopyEmail email={profile.email} />
            </Reveal>
            {channels.map(({ label, value, href, Icon }, i) => (
              <Reveal key={label} delay={0.06 * (i + 1)}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass group flex items-center gap-4 rounded-3xl p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-glow/40 sm:p-6"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/5 text-white ring-1 ring-white/10 transition group-hover:bg-cyan-glow/15 group-hover:text-cyan-glow">
                    <Icon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs tracking-widest text-ink-muted uppercase">{label}</span>
                    <span className="block truncate font-display text-lg text-white">{value}</span>
                  </span>
                  <ArrowUpRightIcon className="text-ink-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-glow" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <SpotlightCard glowBorder className="p-6 sm:p-10">
              <ContactForm />
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
