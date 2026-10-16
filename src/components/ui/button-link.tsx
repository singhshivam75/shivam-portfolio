import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  external?: boolean;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-violet-glow to-cyan-glow text-midnight-950 shadow-[0_10px_40px_-10px_rgb(139_92_246/0.8)] hover:shadow-[0_16px_50px_-8px_rgb(34_211_238/0.7)]",
  ghost: "glass text-ink hover:border-cyan-glow/40 hover:text-white",
};

export function ButtonLink({
  href,
  variant = "primary",
  external = false,
  className = "",
  children,
  ...rest
}: ButtonLinkProps) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <a
      href={href}
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold transition duration-300 ${variants[variant]} ${className}`}
      {...externalProps}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition duration-700 group-hover:translate-x-full"
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </a>
  );
}
