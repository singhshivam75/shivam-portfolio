import { monitorCode, sidePanels, type CodePanelSpec } from "./code-lines";

function CodeCard({ spec, className }: { spec: CodePanelSpec; className: string }) {
  return (
    <div className={`glass absolute rounded-2xl p-4 font-mono text-[10px] leading-5 sm:text-xs ${className}`}>
      <div className="mb-3 flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-red-400" />
        <span className="size-2 rounded-full bg-amber-300" />
        <span className="size-2 rounded-full bg-emerald-400" />
        <span className="ml-2 text-ink-muted">{spec.title}</span>
      </div>
      <pre className="whitespace-pre text-violet-100/90">{spec.lines.join("\n")}</pre>
    </div>
  );
}

const CHIPS = [
  { label: "React", className: "top-[8%] right-[12%] [animation-delay:-1s]" },
  { label: "Next.js", className: "top-[44%] left-[4%] [animation-delay:-3s]" },
  { label: "Node.js", className: "bottom-[16%] right-[6%] [animation-delay:-2s]" },
  { label: "AWS", className: "bottom-[6%] left-[22%] [animation-delay:-4s]" },
] as const;

/** Lightweight CSS-only stand-in for the WebGL scene (mobile, reduced motion, no WebGL). */
export function StaticWorkspace() {
  const [left, right] = sidePanels;
  return (
    <div className="absolute inset-0 overflow-hidden [perspective:1200px]">
      <div className="absolute top-1/2 right-[-10%] size-[80vmin] -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(139_92_246/0.22),transparent)]" />
      <div className="absolute inset-x-0 top-[58%] bottom-0 opacity-30 sm:top-[46%] sm:opacity-50 lg:top-[18%] lg:left-[40%] lg:opacity-75">
        <div className="relative mx-auto h-full max-w-xl [transform:rotateX(16deg)_rotateY(-14deg)] [transform-style:preserve-3d]">
          <div className="mobile-still absolute inset-x-[4%] top-[12%] h-[70%] animate-spin-slow rounded-full border border-violet-glow/20" />
          <CodeCard spec={monitorCode} className="top-6 left-[8%] w-[80%] shadow-[0_0_90px_-20px_rgb(34_211_238/0.55)]" />
          {left ? <CodeCard spec={left} className="mobile-still top-0 -left-6 hidden w-52 -rotate-6 animate-float sm:block" /> : null}
          {right ? (
            <CodeCard spec={right} className="mobile-still top-44 right-0 w-44 rotate-3 animate-float [animation-delay:-3s] sm:w-52" />
          ) : null}
          {CHIPS.map((chip) => (
            <span
              key={chip.label}
              className={`glass mobile-still absolute animate-float rounded-full px-3 py-1.5 font-mono text-[10px] text-cyan-100 ${chip.className}`}
            >
              {chip.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
