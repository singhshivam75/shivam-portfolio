import type { CSSProperties } from "react";
import type { LabHotspot, LabSceneId } from "@/types/ai-lab";
import { SCENE_LAYOUTS, type Vec3 } from "./layout";

const PALETTE = ["#8b5cf6", "#a78bfa", "#818cf8", "#67e8f9", "#22d3ee"] as const;

type Orientation = "horizontal" | "vertical";

interface LabFallbackProps {
  sceneId: LabSceneId;
  hotspots: readonly LabHotspot[];
  selected: string | null;
  onSelect: (id: string) => void;
}

/** Lightweight SVG version of each scene for phones, reduced motion and devices without WebGL. */
export function LabFallback(props: LabFallbackProps) {
  const vertical = props.sceneId !== "neural";
  return (
    <>
      <div className={`h-full ${vertical ? "hidden sm:block" : ""}`}>
        <FallbackDiagram {...props} orientation="horizontal" />
      </div>
      {vertical ? (
        <div className="h-full sm:hidden">
          <FallbackDiagram {...props} orientation="vertical" />
        </div>
      ) : null}
    </>
  );
}

function FallbackDiagram({ sceneId, hotspots, selected, onSelect, orientation }: LabFallbackProps & { orientation: Orientation }) {
  const layout = SCENE_LAYOUTS[sceneId];
  const project = ([x, y]: Vec3) => (orientation === "vertical" ? ([y * 1.2, x * 0.95] as const) : ([x, -y] as const));
  const point = (id: string) => project(layout.points[id] ?? [0, 0, 0]);
  const gradientId = `lab-edge-${sceneId}-${orientation}`;
  const glowId = `lab-glow-${sceneId}-${orientation}`;

  const coords = Object.keys(layout.points).map(point);
  const xs = coords.map(([x]) => x);
  const ys = coords.map(([, y]) => y);
  const minX = Math.min(...xs) - 1.7;
  const minY = Math.min(...ys) - 1.1;
  const viewBox = `${minX} ${minY} ${Math.max(...xs) + 1.7 - minX} ${Math.max(...ys) + 1.4 - minY}`;
  const fontSize = orientation === "vertical" ? 0.36 : 0.32;

  const loopPath = (() => {
    if (!layout.loop) return null;
    const [x1, y1] = point(layout.loop[0]);
    const [x2, y2] = point(layout.loop[1]);
    const length = Math.hypot(x2 - x1, y2 - y1) || 1;
    const bulge = orientation === "vertical" ? -2 : 2.2;
    const cx = (x1 + x2) / 2 + (-(y2 - y1) / length) * bulge;
    const cy = (y1 + y2) / 2 + ((x2 - x1) / length) * bulge;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  })();

  return (
    <svg viewBox={viewBox} className="h-full w-full" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={orientation === "vertical" ? 0 : Math.min(...xs)}
          y1={orientation === "vertical" ? Math.min(...ys) : 0}
          x2={orientation === "vertical" ? 0 : Math.max(...xs)}
          y2={orientation === "vertical" ? Math.max(...ys) : 0}
        >
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {layout.edges.map(([from, to], i) => {
        const [x1, y1] = point(from);
        const [x2, y2] = point(to);
        return (
          <g key={`${from}-${to}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={`url(#${gradientId})`}
              strokeWidth={from.startsWith("_") && to.startsWith("_") ? 0.09 : 0.04}
              strokeLinecap="round"
              opacity="0.7"
            />
            <circle
              cx={x1}
              cy={y1}
              r="0.07"
              fill="#e0f2ff"
              className="lab-packet"
              style={{ "--dx": `${x2 - x1}px`, "--dy": `${y2 - y1}px`, "--delay": `${i * 0.35}s` } as CSSProperties}
            />
          </g>
        );
      })}

      {loopPath ? (
        <path d={loopPath} fill="none" stroke="#a78bfa" strokeWidth="0.03" strokeDasharray="0.12 0.12" opacity="0.8" />
      ) : null}

      {Object.keys(layout.points)
        .filter((id) => id.startsWith("_"))
        .map((id) => {
          const [x, y] = point(id);
          return <circle key={id} cx={x} cy={y} r="0.1" fill="#a78bfa" />;
        })}

      {hotspots.map((hotspot, i) => {
        const [x, y] = point(hotspot.id);
        const color = PALETTE[i % PALETTE.length];
        const active = selected === hotspot.id;
        return (
          <g key={hotspot.id} className="cursor-pointer" onClick={() => onSelect(hotspot.id)}>
            <circle cx={x} cy={y} r="0.9" fill={`url(#${glowId})`} opacity={active ? 1 : 0.55} />
            <circle cx={x} cy={y} r="0.42" fill="#050816" stroke={active ? "#22d3ee" : color} strokeWidth={active ? 0.07 : 0.04} />
            <circle cx={x} cy={y} r="0.17" fill={color} />
            <text
              x={x}
              y={y + 0.8}
              textAnchor="middle"
              fontSize={fontSize}
              fill={active ? "#ffffff" : "#98a1c8"}
              fontFamily="var(--font-mono), monospace"
            >
              {hotspot.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
