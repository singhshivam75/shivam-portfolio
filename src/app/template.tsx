"use client";

import { useEffect, useState, type ReactNode } from "react";

let hasNavigated = false;

/**
 * Fades in route changes; the first paint is left untouched so content is visible immediately.
 * Only opacity is animated: transforms or filters here would break `position: fixed` descendants.
 * Also hosts the single observer behind every `data-reveal` element on the page.
 */
export default function Template({ children }: { children: ReactNode }) {
  const [animateIn] = useState(() => hasNavigated);

  useEffect(() => {
    hasNavigated = true;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return <div className={animateIn ? "page-enter" : undefined}>{children}</div>;
}
