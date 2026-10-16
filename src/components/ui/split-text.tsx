import type { CSSProperties } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}

/** Reveals text word by word. Screen readers get the full string once. */
export function SplitText({ text, className = "", wordClassName = "", delay = 0, stagger = 0.06 }: SplitTextProps) {
  const words = text.split(" ");
  const vars = { "--reveal-delay": `${delay * 1000}ms`, "--reveal-stagger": `${stagger * 1000}ms` } as CSSProperties;

  return (
    <span className={className} data-reveal="words" style={vars}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span className={`reveal-word inline-block ${wordClassName}`} style={{ "--i": index } as CSSProperties}>
              {word}
            </span>
            {index < words.length - 1 ? "\u00a0" : null}
          </span>
        ))}
      </span>
    </span>
  );
}
