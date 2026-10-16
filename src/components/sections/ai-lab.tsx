import { LabStage } from "@/components/ai-lab/lab-stage";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { labScenes } from "@/content/ai-lab";

interface AiLabProps {
  index: number;
  aiSkills: readonly string[];
}

export function AiLab({ index, aiSkills }: AiLabProps) {
  const listed = new Set(aiSkills);
  const scenes = labScenes.map((scene) => ({
    ...scene,
    hotspots: scene.hotspots.map((hotspot) => ({
      ...hotspot,
      skills: hotspot.skills?.filter((skill) => listed.has(skill)),
    })),
  }));

  return (
    <Section
      id="ai-lab"
      index={index}
      eyebrow="AI & Engineering Lab"
      title="Step inside the systems."
      description="Four interactive 3D scenes. Pick one, then click any glowing node to see what it does."
    >
      <Reveal>
        <LabStage scenes={scenes} />
      </Reveal>
    </Section>
  );
}
