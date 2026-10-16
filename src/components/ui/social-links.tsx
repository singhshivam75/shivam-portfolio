import type { Profile } from "@/types/content";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";

interface SocialLinksProps {
  profile: Profile;
}

export function SocialLinks({ profile }: SocialLinksProps) {
  const links = [
    { href: profile.links.github, label: "GitHub", Icon: GitHubIcon, external: true },
    { href: profile.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon, external: true },
    { href: `mailto:${profile.email}`, label: "Email", Icon: MailIcon, external: false },
  ];

  return (
    <ul className="flex items-center gap-3">
      {links.map(({ href, label, Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="glass grid size-11 place-items-center rounded-xl text-ink-muted transition hover:-translate-y-0.5 hover:text-cyan-glow"
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
