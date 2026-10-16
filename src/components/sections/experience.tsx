import type { ExperienceItem } from "@/types/content";
import { Section } from "@/components/ui/section";
import { ExperienceTimeline } from "./experience-timeline";

interface ExperienceProps {
  index: number;
  items: readonly ExperienceItem[];
}

export function Experience({ index, items }: ExperienceProps) {
  return (
    <Section
      id="experience"
      index={index}
      eyebrow="Experience"
      title="Where I've built and shipped."
      description={`Production platforms, admin systems and mobile apps across ${items.length} ${items.length === 1 ? "company" : "companies"}.`}
    >
      <ExperienceTimeline items={items} />
    </Section>
  );
}
