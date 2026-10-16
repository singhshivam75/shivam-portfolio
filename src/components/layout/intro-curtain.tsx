interface IntroCurtainProps {
  name: string;
  role: string;
}

export function IntroCurtain({ name, role }: IntroCurtainProps) {
  return (
    <div
      aria-hidden="true"
      className="intro-curtain pointer-events-none fixed inset-0 z-[100] hidden place-items-center bg-midnight-950 md:grid"
    >
      <div className="text-center">
        <p className="overflow-hidden font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
          <span className="intro-word inline-block text-gradient opacity-0">{name}</span>
        </p>
        <p className="mt-3 overflow-hidden font-mono text-xs tracking-[0.4em] text-ink-muted uppercase">
          <span className="intro-word inline-block opacity-0 [animation-delay:0.15s]">{role}</span>
        </p>
        <div className="mx-auto mt-8 h-px w-48 overflow-hidden bg-white/10">
          <div className="intro-bar h-full origin-left scale-x-0 bg-gradient-to-r from-violet-glow to-cyan-glow" />
        </div>
      </div>
    </div>
  );
}
