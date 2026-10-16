/** Client-only check; call from event handlers or effects, never during render. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Matches the site's `--ease-out-expo` curve closely enough for JS-driven tweens. */
export function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - 2 ** (-10 * t);
}
