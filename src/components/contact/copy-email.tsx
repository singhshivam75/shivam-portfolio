"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon, MailIcon } from "@/components/ui/icons";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="glass spotlight group relative flex items-center gap-4 rounded-3xl p-5 sm:p-6">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-glow to-cyan-glow text-midnight-950">
        <MailIcon />
      </span>
      <a href={`mailto:${email}`} className="min-w-0 flex-1">
        <span className="block text-xs tracking-widest text-ink-muted uppercase">Email me</span>
        <span className="block truncate font-display text-lg font-medium text-white transition group-hover:text-cyan-glow sm:text-xl">
          {email}
        </span>
      </a>
      <button
        type="button"
        onClick={copy}
        data-cursor={copied ? "Copied" : "Copy"}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 text-ink-muted transition hover:border-cyan-glow/50 hover:text-cyan-glow"
      >
        <span key={copied ? "check" : "copy"} className={copied ? "icon-swap text-emerald-300" : "icon-swap"}>
          {copied ? <CheckIcon width={18} height={18} /> : <CopyIcon width={18} height={18} />}
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
