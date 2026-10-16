import type { ReactNode } from "react";
import { PointerTilt } from "./pointer-tilt";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  return (
    <div className="h-full [perspective:1100px]">
      <PointerTilt
        className={`tilt-surface glass group relative h-full overflow-hidden rounded-2xl [transform-style:preserve-3d] ${className}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at calc((var(--px, 0) + 0.5) * 100%) calc((var(--py, 0) + 0.5) * 100%), rgb(139 92 246 / 0.18), transparent 60%)",
          }}
        />
        {children}
      </PointerTilt>
    </div>
  );
}
