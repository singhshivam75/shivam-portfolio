import type { CSSProperties } from "react";

interface TechOrbitProps {
  items: readonly string[];
  centerLabel: string;
}

interface Ring {
  items: readonly string[];
  radius: number;
  duration: number;
  reverse: boolean;
}

function OrbitRing({ items, radius, duration, reverse }: Ring) {
  const spin: CSSProperties = { animation: `${reverse ? "spin-reverse" : "spin"} ${duration}s linear infinite` };
  const counter: CSSProperties = { animation: `${reverse ? "spin" : "spin-reverse"} ${duration}s linear infinite` };

  return (
    <div className="absolute inset-0" style={spin}>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
        style={{ width: `${radius * 2}%`, height: `${radius * 2}%` }}
      />
      {items.map((item, index) => {
        const angle = (index / items.length) * Math.PI * 2;
        return (
          <div
            key={item}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${50 + Math.cos(angle) * radius}%`, top: `${50 + Math.sin(angle) * radius}%` }}
          >
            <div style={counter}>
              <span className="block rounded-full border border-[rgb(148_163_255/0.14)] bg-[linear-gradient(150deg,rgb(18_26_70/0.92),rgb(5_8_22/0.92))] px-3 py-1.5 font-mono text-[11px] whitespace-nowrap text-cyan-50 shadow-[0_0_24px_-6px_rgb(34_211_238/0.6)] sm:text-xs">
                {item}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** CSS-only orbit of technologies around a glowing core. */
export function TechOrbit({ items, centerLabel }: TechOrbitProps) {
  const inner = items.filter((_, index) => index % 2 === 0);
  const outer = items.filter((_, index) => index % 2 === 1);

  return (
    <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[460px]">
      <div className="absolute inset-[10%] bg-[radial-gradient(closest-side,rgb(139_92_246/0.24),transparent)]" />
      <OrbitRing items={outer} radius={46} duration={60} reverse />
      <OrbitRing items={inner} radius={30} duration={45} reverse={false} />
      <div className="absolute top-1/2 left-1/2 grid size-[30%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#c4b5fd_0%,#8b5cf6_35%,#1e1b4b_75%)] shadow-[0_0_80px_rgb(139_92_246/0.6),inset_-10px_-14px_30px_rgb(0_0_0/0.5)]">
        <span className="px-2 text-center font-display text-xs leading-tight font-semibold text-white sm:text-sm">
          {centerLabel}
        </span>
      </div>
    </div>
  );
}
