export interface SocialLinks {
  github: string;
  linkedin: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string | null;
  location: string | null;
  email: string;
  links: SocialLinks;
  /**
   * Public path or absolute URL to a downloadable resume, e.g. "/resume.pdf".
   * Local paths are only linked when the file exists in `public/`.
   */
  resumeUrl: string | null;
  /** About section paragraphs. */
  summary: readonly string[];
  stats: readonly Stat[];
  /** Core technologies shown in the hero code panel and SEO keywords. */
  featuredStack: readonly string[];
  focusAreas: readonly FocusArea[];
}

export type FocusIcon = "web" | "mobile" | "server" | "ai";

export interface FocusArea {
  title: string;
  description: string;
  icon: FocusIcon;
}

export interface SkillGroup {
  title: string;
  skills: readonly string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location?: string;
  summary?: string;
  highlights: readonly string[];
  tech: readonly string[];
}

export interface ProjectLinks {
  github?: string;
  live?: string;
}

/** Layout of the original illustrated cover; not a screenshot of the real product. */
export type ProjectVisual = "mobile" | "listing" | "dashboard" | "kanban";

/** Genuine screenshots of the live product, served from `public/`. */
export interface ProjectPreview {
  desktop: string;
  mobile: string;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  highlights: readonly string[];
  tech: readonly string[];
  links: ProjectLinks;
  /** Used instead of the illustration when real screenshots exist. */
  preview?: ProjectPreview;
  visual: ProjectVisual;
  /** Two hex colours used for the illustrated cover gradient. */
  accent: readonly [string, string];
}

export interface Achievement {
  title: string;
  description?: string;
  date?: string;
  link?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location?: string;
  details: readonly string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company?: string;
  link?: string;
}

export interface PortfolioContent {
  profile: Profile;
  skills: readonly SkillGroup[];
  experience: readonly ExperienceItem[];
  projects: readonly Project[];
  achievements: readonly Achievement[];
  education: readonly EducationItem[];
  testimonials: readonly Testimonial[];
}
