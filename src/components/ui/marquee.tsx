interface MarqueeProps {
  items: readonly string[];
  label: string;
}

export function Marquee({ items, label }: MarqueeProps) {
  if (items.length === 0) return null;
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-10 font-display text-2xl font-medium whitespace-nowrap text-white/30 sm:text-3xl">
          {item}
          <span aria-hidden="true" className="size-1.5 rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      role="region"
      aria-label={label}
      className="relative overflow-hidden border-y border-white/5 bg-midnight-900/40 py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
    >
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
