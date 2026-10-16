import type { Testimonial } from "@/types/content";
import { QuoteIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface TestimonialsProps {
  index: number;
  items: readonly Testimonial[];
}

export function Testimonials({ index, items }: TestimonialsProps) {
  return (
    <Section id="testimonials" index={index} eyebrow="Testimonials" title="Kind words.">
      <ul className="grid gap-5 md:grid-cols-2">
        {items.map((item, i) => (
          <li key={`${item.name}-${i}`}>
            <Reveal delay={0.06 * i} className="h-full">
              <SpotlightCard className="h-full p-8">
                <figure className="flex h-full flex-col">
                  <QuoteIcon className="text-violet-glow" width={32} height={32} />
                  <blockquote className="mt-5 flex-1 font-display text-xl leading-relaxed text-ink">
                    <p>{item.quote}</p>
                  </blockquote>
                  <figcaption className="mt-8 border-t border-white/10 pt-5">
                    <p className="font-semibold text-white">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-glow">
                          {item.name}
                        </a>
                      ) : (
                        item.name
                      )}
                    </p>
                    <p className="text-sm text-ink-muted">
                      {item.role}
                      {item.company ? `, ${item.company}` : ""}
                    </p>
                  </figcaption>
                </figure>
              </SpotlightCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
