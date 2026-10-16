"use server";

import { headers } from "next/headers";
import { z } from "zod";
import {
  contactSchema,
  emptyContactValues,
  type ContactField,
  type ContactFormState,
} from "@/lib/contact-schema";
import { getMailConfig } from "@/lib/env";
import { sendContactEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";

const FIELDS: readonly ContactField[] = ["name", "email", "subject", "message"];

function readValues(formData: FormData): Record<ContactField, string> {
  const values = { ...emptyContactValues };
  for (const field of FIELDS) {
    const raw = formData.get(field);
    values[field] = typeof raw === "string" ? raw.slice(0, 6000) : "";
  }
  return values;
}

async function clientKey(): Promise<string> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || list.get("x-real-ip") || "unknown";
}

export async function sendContactMessage(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = readValues(formData);

  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return { status: "success", message: "Thanks! Your message has been sent.", fieldErrors: {}, values: emptyContactValues };
  }

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const flattened = z.flattenError(parsed.error).fieldErrors;
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const field of FIELDS) {
      const first = flattened[field]?.[0];
      if (first) fieldErrors[field] = first;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }

  if (!rateLimit(`contact:${await clientKey()}`, 5, 10 * 60 * 1000)) {
    return {
      status: "error",
      message: "Too many messages in a short time. Please try again in a few minutes.",
      fieldErrors: {},
      values,
    };
  }

  const config = getMailConfig();
  if (!config) {
    return {
      status: "error",
      message: "The contact form is temporarily unavailable. Please reach out by email instead.",
      fieldErrors: {},
      values,
    };
  }

  try {
    await sendContactEmail(config, parsed.data);
  } catch (error) {
    console.error("[contact] Failed to send email:", error);
    return {
      status: "error",
      message: "Something went wrong while sending your message. Please try again or email me directly.",
      fieldErrors: {},
      values,
    };
  }

  return { status: "success", message: "Thanks! Your message has been sent. I'll get back to you soon.", fieldErrors: {}, values: emptyContactValues };
}
