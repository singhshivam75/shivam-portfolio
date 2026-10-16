import type { PortfolioContent } from "@/types/content";

export type SectionId =
  | "about"
  | "skills"
  | "ai-lab"
  | "experience"
  | "projects"
  | "achievements"
  | "education"
  | "testimonials"
  | "contact";

export interface NavItem {
  id: SectionId;
  label: string;
}

const ALL_SECTIONS: readonly NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "ai-lab", label: "AI Lab" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "achievements", label: "Achievements" },
  { id: "education", label: "Education" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

function findSkills(content: PortfolioContent, title: string): readonly string[] {
  return content.skills.find((group) => group.title === title)?.skills ?? [];
}

export const getAiSkills = (content: PortfolioContent) => findSkills(content, "AI / GenAI");

export function hasSectionContent(id: SectionId, content: PortfolioContent): boolean {
  switch (id) {
    case "about":
      return content.profile.summary.length > 0 || content.profile.stats.length > 0;
    case "skills":
      return content.skills.some((group) => group.skills.length > 0);
    case "ai-lab":
      return getAiSkills(content).length > 0;
    case "experience":
      return content.experience.length > 0;
    case "projects":
      return content.projects.length > 0;
    case "achievements":
      return content.achievements.length > 0;
    case "education":
      return content.education.length > 0;
    case "testimonials":
      return content.testimonials.length > 0;
    case "contact":
      return true;
  }
}

export function getVisibleSections(content: PortfolioContent): NavItem[] {
  return ALL_SECTIONS.filter((section) => hasSectionContent(section.id, content));
}
