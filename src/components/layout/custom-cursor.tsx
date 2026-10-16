"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/use-media-query";

const CursorFollower = dynamic(() => import("./cursor-follower"), { ssr: false });

/** Loads and mounts only on fine pointers (mouse/trackpad) when motion is allowed. */
export function CustomCursor() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  return finePointer && !reduceMotion ? <CursorFollower /> : null;
}
