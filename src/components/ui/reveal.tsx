import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  y?: number;
}

/** Fades content up when it scrolls into view (CSS transition; triggered by the template's observer). */
export function Reveal({ children, delay = 0, y = 28, style, ...rest }: RevealProps) {
  const vars = { "--reveal-delay": `${delay * 1000}ms`, "--reveal-y": `${y}px`, ...style } as CSSProperties;
  return (
    <div data-reveal="up" style={vars} {...rest}>
      {children}
    </div>
  );
}
