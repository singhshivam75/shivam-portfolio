import type { CSSProperties } from "react";

interface StaggerChipsProps {
  items: readonly string[];
  label: string;
}

export function StaggerChips({ items, label }: StaggerChipsProps) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2" data-reveal="stagger">
      {items.map((item, index) => (
        <li key={item} style={{ "--i": index } as CSSProperties}>
          <span className="block rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-sm text-ink transition duration-300 hover:-translate-y-0.5 hover:border-cyan-glow/40 hover:bg-cyan-glow/10 hover:text-white">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
