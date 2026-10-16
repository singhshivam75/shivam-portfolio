import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-sm tracking-[0.3em] text-cyan-glow uppercase">404</p>
        <h1 className="mt-4 font-display text-5xl font-bold text-white">Page not found</h1>
        <p className="mt-4 text-ink-muted">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow px-6 py-3 text-sm font-semibold text-midnight-950"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
