import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";
import type { Profile } from "@/types/content";

export interface ResumeLink {
  href: string;
  /** Suggested filename for the downloaded file. */
  fileName: string;
}

function toFileName(name: string): string {
  const slug = name.trim().split(/\s+/).join("-");
  return `${slug}-Resume.pdf`;
}

/** Resolves the resume download, or null when no real file is available. */
export function getResumeLink(profile: Profile): ResumeLink | null {
  const href = profile.resumeUrl;
  if (!href) return null;

  if (href.startsWith("/")) {
    const file = path.join(process.cwd(), "public", ...href.split("/").filter(Boolean));
    if (!existsSync(file)) return null;
  }

  return { href, fileName: toFileName(profile.name) };
}
