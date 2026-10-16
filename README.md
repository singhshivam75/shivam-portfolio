# Shivam Singh — 3D Developer Portfolio

A single-page portfolio built with Next.js (App Router), TypeScript, Tailwind CSS v4, React Three Fiber and Framer Motion.

- Interactive 3D developer workspace in the hero (desk, monitor rendering live code, floating code panels, particles, mouse-driven camera).
- Automatic CSS-only fallback on phones, low-power devices, `prefers-reduced-motion`, data-saver mode, or when WebGL is unavailable.
- The WebGL render loop pauses when the hero scrolls out of view.
- Sections: Hero, About, Skills, Experience, Projects, Achievements, Education, Testimonials, Contact.
- Contact form backed by a Server Action: Zod validation, honeypot, per-IP rate limiting, HTML escaping, SMTP via Nodemailer.
- SEO: metadata, canonical URL, Open Graph image, JSON-LD `Person`, `robots.txt`, `sitemap.xml`, web manifest.

## Editing content

All personal content lives in **`src/content/portfolio.ts`**, typed by `src/types/content.ts`.

Any section whose list is empty is hidden, and its nav link is removed. Testimonials stay hidden until real ones are added. Only add facts you can stand behind.

To offer a resume download, place the file at `public/resume.pdf`. The download buttons in the hero, navigation, and footer appear automatically once the file exists (rebuild after adding it) and save it as `Shivam-Singh-Resume.pdf`.

Project previews use genuine screenshots of the live sites stored in `public/projects/`; projects without a `preview` fall back to an original illustration.

## Local setup

Requirements: Node.js 20.9+ (tested with Node 22).

```bash
npm install
cp .env.example .env.local   # PowerShell: Copy-Item .env.example .env.local
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run lint
npx tsc --noEmit
npm run build && npm start
```

## Contact form (SMTP)

Set these in `.env.local` (and in your hosting provider's environment settings):

| Variable | Purpose |
| --- | --- |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | SMTP server (e.g. `smtp.gmail.com`, `465`, `true`) |
| `SMTP_USER`, `SMTP_PASS` | SMTP credentials |
| `CONTACT_TO_EMAIL` | Optional. Inbox for messages; defaults to the email in `portfolio.ts` |
| `CONTACT_FROM_EMAIL` | Optional. Sender address; defaults to `SMTP_USER` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for canonical links, sitemap and Open Graph |

For Gmail, enable 2-Step Verification and create an App Password at <https://myaccount.google.com/apppasswords>. Use that as `SMTP_PASS`, not your normal password.

If SMTP is not configured, the form shows a friendly "please email me instead" message, and the server logs what is missing.

The rate limiter is in memory, so on serverless hosts each instance keeps its own count. For strict limits, back it with Redis (e.g. Upstash).

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it at <https://vercel.com/new> (framework preset: Next.js).
3. Add the environment variables above under Project Settings → Environment Variables.
4. Deploy. `VERCEL_PROJECT_PRODUCTION_URL` is used automatically if `NEXT_PUBLIC_SITE_URL` is not set.

## Self-hosting

```bash
npm ci
npm run build
NODE_ENV=production npm start   # serves on port 3000; put a reverse proxy with HTTPS in front
```

## Project structure

```
src/
  app/            layout, page, SEO routes, OG image, Server Action (actions/contact.ts)
  components/
    layout/       navbar, footer, ambient background
    sections/     one component per page section
    three/        WebGL workspace scene, code textures, mobile fallback
    contact/      contact form (client)
    ui/           reusable primitives (Section, GlassCard, TiltCard, Reveal, icons...)
  content/        portfolio.ts — the only file with personal content
  lib/            section visibility, site config, env parsing, mailer, rate limiter
  types/          content types
```
