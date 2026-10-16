import "server-only";
import { z } from "zod";
import { portfolio } from "@/content/portfolio";

const smtpSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_SECURE: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  CONTACT_TO_EMAIL: z.email().optional(),
  CONTACT_FROM_EMAIL: z.email().optional(),
});

export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
  from: string;
}

let cached: MailConfig | null | undefined;

/** Returns SMTP settings, or null when the contact form is not configured. */
export function getMailConfig(): MailConfig | null {
  if (cached !== undefined) return cached;

  const parsed = smtpSchema.safeParse({
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT || undefined,
    SMTP_SECURE: process.env.SMTP_SECURE || undefined,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || undefined,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL || undefined,
  });

  if (!parsed.success) {
    console.error("[contact] SMTP is not configured:", z.prettifyError(parsed.error));
    cached = null;
    return cached;
  }

  const env = parsed.data;
  cached = {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE ?? env.SMTP_PORT === 465,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    to: env.CONTACT_TO_EMAIL ?? portfolio.profile.email,
    from: env.CONTACT_FROM_EMAIL ?? env.SMTP_USER,
  };
  return cached;
}
