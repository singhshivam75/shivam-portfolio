import { portfolio } from "@/content/portfolio";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

const { profile } = portfolio;

export const siteConfig = {
  url: resolveSiteUrl(),
  title: `${profile.name} | ${profile.role}`,
  description:
    profile.tagline ??
    `Portfolio of ${profile.name}, ${profile.role.toLowerCase()}. Experience, projects, skills and contact details.`,
  name: profile.name,
} as const;
