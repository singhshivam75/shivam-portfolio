import Image from "next/image";
import type { CSSProperties } from "react";
import type { ProjectPreview, ProjectVisual } from "@/types/content";
import { PointerTilt } from "@/components/ui/pointer-tilt";
import { CoverArt } from "./cover-art";

interface ProjectCoverProps {
  visual: ProjectVisual;
  accent: readonly [string, string];
  title: string;
  preview?: ProjectPreview;
  liveUrl?: string;
}

function hostOf(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

function depth(x: number, y: number): CSSProperties {
  return { "--depth-x": `${x}px`, "--depth-y": `${y}px` } as CSSProperties;
}

/** Tilting cover with pointer parallax: live screenshots when available, otherwise an original illustration. */
export function ProjectCover({ visual, accent, title, preview, liveUrl }: ProjectCoverProps) {
  const vars = { "--a": accent[0], "--b": accent[1], "--tilt-x": "-16deg", "--tilt-y": "20deg" } as CSSProperties;
  const host = hostOf(liveUrl);

  return (
    <div className="[perspective:1400px]">
      <PointerTilt
        style={vars}
        className="tilt-surface group/cover relative aspect-[16/11] overflow-hidden rounded-3xl border border-white/10 bg-midnight-900 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]"
        role="img"
        aria-label={
          preview
            ? `Screenshots of the ${title} live website on desktop and mobile`
            : `Illustration representing ${title}`
        }
      >
        <div
          aria-hidden="true"
          className="parallax-layer absolute -inset-16 opacity-80"
          style={{
            ...depth(-80, -60),
            background: "radial-gradient(circle at 25% 20%, var(--a), transparent 52%), radial-gradient(circle at 80% 85%, var(--b), transparent 52%)",
          }}
        />
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-60" />
        <div aria-hidden="true" className="bg-noise absolute inset-0 hidden opacity-[0.06] mix-blend-overlay md:block" />

        {preview ? (
          <>
            <div
              aria-hidden="true"
              className="parallax-layer absolute top-[12%] left-[6%] w-[76%] group-hover/cover:scale-[1.02]"
              style={depth(28, 20)}
            >
              <div className="overflow-hidden rounded-xl border border-white/15 bg-midnight-950 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.85)] ring-1 ring-black/40">
                <div className="flex items-center gap-[1.5%] border-b border-white/10 bg-midnight-800/90 px-[2.5%] py-[1.6%]">
                  <span className="size-1.5 rounded-full bg-[#ff5f57] sm:size-2" />
                  <span className="size-1.5 rounded-full bg-[#febc2e] sm:size-2" />
                  <span className="size-1.5 rounded-full bg-[#28c840] sm:size-2" />
                  {host ? (
                    <span className="mx-auto truncate rounded-md bg-white/[0.06] px-3 py-0.5 font-mono text-[9px] text-ink-muted sm:text-[10px]">
                      {host}
                    </span>
                  ) : null}
                </div>
                <div className="relative aspect-[16/10]">
                  <Image
                    src={preview.desktop}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 80vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="parallax-layer absolute right-[6%] bottom-[7%] w-[22%] group-hover/cover:-translate-y-[4%]"
              style={depth(56, 40)}
            >
              <div className="rounded-[1.4rem] border border-white/20 bg-black p-[4%] shadow-[0_30px_70px_-15px_rgb(0_0_0/0.95),0_0_40px_-10px_var(--b)]">
                <div className="relative aspect-[390/844] overflow-hidden rounded-[1.05rem]">
                  <Image
                    src={preview.mobile}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 160px, 22vw"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            aria-hidden="true"
            className="parallax-layer absolute inset-[9%] group-hover/cover:scale-[1.03]"
            style={depth(28, 20)}
          >
            <CoverArt visual={visual} />
          </div>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent opacity-0 transition-opacity duration-500 group-hover/cover:opacity-100"
        />
        <span
          className={`absolute font-mono text-[9px] tracking-widest text-white/45 uppercase sm:text-[10px] ${preview ? "top-[3%] right-[4%]" : "bottom-3 left-4"}`}
        >
          {preview ? "Live site screenshot" : "Illustration"}
        </span>
      </PointerTilt>
    </div>
  );
}
