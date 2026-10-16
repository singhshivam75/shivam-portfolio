"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import type { CodePanelSpec } from "./code-lines";

const WIDTH = 1024;
const HEIGHT = 640;
const MAX_LINES = 11;
const KEYWORDS = /^(export|const|function|return|default|import|from|let|type|interface|await|async)$/;
const PUNCTUATION = /^[{}()[\];,.:=<>/]$/;
const TYPE_SPEED = 46;
const HOLD_SECONDS = 6;
const REPAINT_INTERVAL = 0.05;

const palette = {
  background: "rgba(6, 9, 28, 0.94)",
  header: "rgba(18, 24, 66, 0.96)",
  text: "#e2e6ff",
  muted: "#6d76a8",
  keyword: "#b39dff",
  string: "#6ee7f9",
  punctuation: "#8790c6",
  prompt: "#22d3ee",
  caret: "#22d3ee",
};

function resolveMonoFont(): string {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains-mono").trim();
  return family || "ui-monospace, monospace";
}

function drawLine(ctx: CanvasRenderingContext2D, line: string, x: number, y: number): number {
  if (line.startsWith("$")) {
    ctx.fillStyle = palette.prompt;
    ctx.fillText(line, x, y);
    return x + ctx.measureText(line).width;
  }

  const tokens = line.split(/("[^"]*"?|\s+|[{}()[\];,.:=<>/])/).filter(Boolean);
  let cursor = x;
  for (const token of tokens) {
    if (token.startsWith('"')) ctx.fillStyle = palette.string;
    else if (KEYWORDS.test(token)) ctx.fillStyle = palette.keyword;
    else if (PUNCTUATION.test(token)) ctx.fillStyle = palette.punctuation;
    else ctx.fillStyle = palette.text;
    ctx.fillText(token, cursor, y);
    cursor += ctx.measureText(token).width;
  }
  return cursor;
}

function paint(canvas: HTMLCanvasElement, spec: CodePanelSpec, visibleChars: number, caretOn: boolean) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const font = resolveMonoFont();

  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = palette.background;
  ctx.beginPath();
  ctx.roundRect(0, 0, WIDTH, HEIGHT, 36);
  ctx.fill();

  const glow = ctx.createLinearGradient(0, 0, WIDTH, 0);
  glow.addColorStop(0, "rgba(139, 92, 246, 0.9)");
  glow.addColorStop(1, "rgba(34, 211, 238, 0.9)");
  ctx.fillStyle = palette.header;
  ctx.beginPath();
  ctx.roundRect(0, 0, WIDTH, 78, [36, 36, 0, 0]);
  ctx.fill();
  ctx.fillStyle = glow;
  ctx.fillRect(0, 76, WIDTH, 3);

  ["#f87171", "#fbbf24", "#34d399"].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(46 + index * 36, 39, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = palette.muted;
  ctx.font = `500 26px ${font}`;
  ctx.textBaseline = "middle";
  ctx.fillText(spec.title, 170, 40);

  ctx.font = `500 30px ${font}`;
  ctx.textBaseline = "alphabetic";
  const lineHeight = 46;
  let remaining = visibleChars;
  let caret: { x: number; y: number } | null = null;

  spec.lines.slice(0, MAX_LINES).forEach((line, index) => {
    const y = 140 + index * lineHeight;
    if (remaining < 0) return;
    ctx.fillStyle = palette.muted;
    ctx.fillText(String(index + 1).padStart(2, " "), 32, y);
    const shown = line.slice(0, Math.max(0, remaining));
    const endX = drawLine(ctx, shown, 100, y);
    if (remaining <= line.length) caret ??= { x: endX, y };
    remaining -= line.length + 1;
  });

  const finalCaret = caret as { x: number; y: number } | null;
  if (caretOn && finalCaret) {
    ctx.fillStyle = palette.caret;
    ctx.fillRect(finalCaret.x + 3, finalCaret.y - 26, 15, 32);
  }
}

function repaintTexture(texture: CanvasTexture, spec: CodePanelSpec, visibleChars: number, caretOn: boolean) {
  paint(texture.image as HTMLCanvasElement, spec, visibleChars, caretOn);
  texture.needsUpdate = true;
}

function countChars(spec: CodePanelSpec): number {
  return spec.lines.slice(0, MAX_LINES).reduce((sum, line) => sum + line.length + 1, 0);
}

/** Canvas texture of a code editor. With `typing`, characters appear progressively and loop. */
export function useCodeTexture(spec: CodePanelSpec, typing = false): CanvasTexture {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    result.anisotropy = 4;
    return result;
  }, []);
  const total = useMemo(() => countChars(spec), [spec]);
  const progress = useRef({ chars: typing ? 0 : total, hold: 0, sinceRepaint: 0, time: 0 });

  useEffect(() => {
    let cancelled = false;
    const render = () => {
      if (!cancelled) repaintTexture(texture, spec, progress.current.chars, false);
    };
    render();
    void document.fonts.ready.then(render);
    return () => {
      cancelled = true;
    };
  }, [spec, texture]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((_, delta) => {
    if (!typing) return;
    const state = progress.current;
    state.time += delta;
    state.sinceRepaint += delta;
    if (state.sinceRepaint < REPAINT_INTERVAL) return;

    const step = state.sinceRepaint;
    state.sinceRepaint = 0;
    if (state.chars < total) {
      state.chars = Math.min(total, state.chars + step * TYPE_SPEED);
    } else {
      state.hold += step;
      if (state.hold > HOLD_SECONDS) {
        state.chars = 0;
        state.hold = 0;
      }
    }
    repaintTexture(texture, spec, Math.floor(state.chars), Math.floor(state.time * 2.2) % 2 === 0);
  });

  return texture;
}

export const CODE_TEXTURE_ASPECT = WIDTH / HEIGHT;
