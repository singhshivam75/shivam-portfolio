import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import type { ContactInput } from "./contact-schema";
import type { MailConfig } from "./env";

let transporter: Transporter | null = null;

function getTransporter(config: MailConfig): Transporter {
  transporter ??= nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
  });
  return transporter;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(config: MailConfig, input: ContactInput): Promise<void> {
  const subject = input.subject || `New message from ${input.name}`;
  const safe = {
    name: escapeHtml(input.name),
    email: escapeHtml(input.email),
    subject: escapeHtml(subject),
    message: escapeHtml(input.message).replace(/\n/g, "<br />"),
  };

  await getTransporter(config).sendMail({
    from: { name: "Portfolio Contact", address: config.from },
    to: config.to,
    replyTo: { name: input.name, address: input.email },
    subject: `[Portfolio] ${subject}`,
    text: `Name: ${input.name}\nEmail: ${input.email}\nSubject: ${subject}\n\n${input.message}`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#111">
        <h2 style="margin:0 0 12px">New portfolio message</h2>
        <p><strong>Name:</strong> ${safe.name}<br /><strong>Email:</strong> ${safe.email}<br /><strong>Subject:</strong> ${safe.subject}</p>
        <hr style="border:none;border-top:1px solid #ddd" />
        <p>${safe.message}</p>
      </div>`,
  });
}
