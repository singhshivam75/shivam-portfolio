"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { ResumeLink } from "@/lib/resume";
import type { NavItem, SectionId } from "@/lib/sections";
import { CloseIcon, DownloadIcon, MenuIcon } from "@/components/ui/icons";

interface NavbarProps {
  items: readonly NavItem[];
  name: string;
  resume: ResumeLink | null;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export function Navbar({ items, name, resume }: NavbarProps) {
  const [active, setActive] = useState<SectionId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = items.filter((item) => item.id !== "contact");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    items.forEach((item) => {
      const node = document.getElementById(item.id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-midnight-950"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-8 ${scrolled ? "pt-3" : "pt-6"}`}
      >
        <a href="#top" className="group flex items-center gap-3" aria-label={`${name}, back to top`}>
          <span className="relative grid size-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-glow to-cyan-glow font-display text-sm font-bold text-midnight-950 transition duration-500 group-hover:rotate-[-8deg] group-hover:scale-105">
            {initials(name)}
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-wide text-white sm:block">{name}</span>
        </a>

        <ul
          className={`hidden items-center gap-1 rounded-full p-1.5 transition-all duration-500 lg:flex ${scrolled ? "glass" : "border border-transparent"}`}
        >
          {links.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={`relative block rounded-full px-4 py-2 text-sm transition ${active === item.id ? "text-white" : "text-ink-muted hover:text-white"}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-violet-glow/25 to-cyan-glow/20 ring-1 ring-white/10 transition duration-300 ${active === item.id ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
                />
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {resume ? (
            <a
              href={resume.href}
              download={resume.fileName}
              type="application/pdf"
              data-cursor="Download"
              className="glass hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-cyan-glow/40 hover:text-white md:inline-flex"
            >
              <DownloadIcon width={15} height={15} />
              Resume
              <span className="sr-only">(PDF download)</span>
            </a>
          ) : null}
          <a
            href="#contact"
            className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-midnight-950 transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgb(34_211_238/0.9)] sm:inline-flex"
          >
            Let&apos;s talk
          </a>
          <button
            type="button"
            className="glass grid size-11 place-items-center rounded-xl text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        data-open={open || undefined}
        inert={!open}
        className="mobile-nav fixed inset-0 -z-10 bg-midnight-950/95 backdrop-blur-2xl lg:hidden"
      >
        <div className="flex h-full flex-col justify-center gap-10 px-8">
          <ul className="flex flex-col gap-2">
            {items.map((item, index) => (
              <li key={item.id} className="menu-item" style={{ "--i": index } as CSSProperties}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-2 font-display text-4xl font-semibold text-white transition hover:text-cyan-glow"
                >
                  <span className="font-mono text-xs text-ink-muted">{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {resume ? (
            <a
              href={resume.href}
              download={resume.fileName}
              type="application/pdf"
              onClick={() => setOpen(false)}
              style={{ "--i": items.length } as CSSProperties}
              className="menu-item inline-flex w-fit items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow px-6 py-3.5 text-sm font-semibold text-midnight-950"
            >
              <DownloadIcon width={16} height={16} />
              Download Resume
              <span className="sr-only">(PDF)</span>
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
