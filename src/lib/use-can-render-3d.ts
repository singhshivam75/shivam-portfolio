"use client";

import { useSyncExternalStore } from "react";

const QUERIES = ["(prefers-reduced-motion: reduce)", "(min-width: 768px)"] as const;

interface NavigatorWithConnection extends Navigator {
  connection?: { saveData?: boolean };
}

let webglSupported: boolean | undefined;

function detectWebGL(): boolean {
  if (webglSupported !== undefined) return webglSupported;
  try {
    const canvas = document.createElement("canvas");
    webglSupported = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    webglSupported = false;
  }
  return webglSupported;
}

function subscribe(onChange: () => void): () => void {
  const lists = QUERIES.map((query) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener("change", onChange));
  return () => lists.forEach((list) => list.removeEventListener("change", onChange));
}

function getSnapshot(): boolean {
  if (window.matchMedia(QUERIES[0]).matches) return false;
  if (!window.matchMedia(QUERIES[1]).matches) return false;
  const nav = navigator as NavigatorWithConnection;
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 4) < 4) return false;
  return detectWebGL();
}

function getServerSnapshot(): boolean {
  return false;
}

/** True when the device can comfortably render the interactive WebGL scene. */
export function useCanRender3D(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
