"use client";

import { useActionState, useState, type ReactNode } from "react";
import { sendContactMessage } from "@/app/actions/contact";
import { initialContactState, type ContactField, type ContactFormState } from "@/lib/contact-state";
import { CheckIcon, SendIcon } from "@/components/ui/icons";

interface FieldProps {
  name: ContactField;
  label: string;
  error?: string;
  optional?: boolean;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string; className: string }) => ReactNode;
}

const controlClass =
  "peer w-full rounded-2xl border border-white/10 bg-midnight-950/60 px-4 pt-6 pb-2.5 text-ink outline-none transition duration-300 placeholder:text-transparent focus:border-cyan-glow/60 focus:bg-midnight-900/80 focus:shadow-[0_0_0_4px_rgb(34_211_238/0.12),0_0_40px_-10px_rgb(34_211_238/0.5)] aria-[invalid=true]:border-rose-400/60";

function Field({ name, label, error, optional = false, children }: FieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  return (
    <div className="relative">
      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
        className: controlClass,
      })}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-4 left-4 origin-left text-ink-muted transition-all duration-200 peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-cyan-glow peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]"
      >
        {label}
        {optional ? <span className="ml-1 opacity-60">(optional)</span> : null}
      </label>
      {error ? (
        <p id={errorId} className="mt-2 pl-1 text-sm text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SuccessPanel({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="pop-in absolute inset-0 z-10 grid place-items-center rounded-3xl bg-midnight-900/95 p-8 text-center backdrop-blur-xl">
      <div>
        <span className="check-in mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-glow text-midnight-950 shadow-[0_0_60px_rgb(52_211_153/0.5)]">
          <CheckIcon width={30} height={30} strokeWidth={2.4} />
        </span>
        <p className="mt-6 font-display text-2xl font-semibold text-white">Message sent</p>
        <p className="mt-2 text-ink-muted">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-8 rounded-full border border-white/15 px-5 py-2 text-sm text-white transition hover:border-cyan-glow/50 hover:text-cyan-glow"
        >
          Send another message
        </button>
      </div>
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialContactState);
  const [dismissed, setDismissed] = useState<ContactFormState | null>(null);
  const [messageLength, setMessageLength] = useState(0);
  const { fieldErrors, values } = state;
  const showSuccess = state.status === "success" && dismissed !== state;

  return (
    <div className="relative">
      {showSuccess ? <SuccessPanel message={state.message} onDismiss={() => setDismissed(state)} /> : null}

      <form action={formAction} noValidate className="flex flex-col gap-5" aria-busy={pending}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="name" label="Your name" error={fieldErrors.name}>
            {(props) => (
              <input {...props} name="name" type="text" autoComplete="name" required minLength={2} maxLength={100} defaultValue={values.name} placeholder="Your name" />
            )}
          </Field>
          <Field name="email" label="Email address" error={fieldErrors.email}>
            {(props) => (
              <input {...props} name="email" type="email" autoComplete="email" required maxLength={254} defaultValue={values.email} placeholder="Email address" />
            )}
          </Field>
        </div>

        <Field name="subject" label="Subject" optional error={fieldErrors.subject}>
          {(props) => <input {...props} name="subject" type="text" maxLength={150} defaultValue={values.subject} placeholder="Subject" />}
        </Field>

        <Field name="message" label="Tell me about your project, role or idea" error={fieldErrors.message}>
          {(props) => (
            <textarea
              {...props}
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={6}
              defaultValue={values.message}
              placeholder="Message"
              onChange={(event) => setMessageLength(event.currentTarget.value.length)}
              className={`${props.className} resize-y`}
            />
          )}
        </Field>

        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="contact-company">Company</label>
          <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p
            role="status"
            aria-live="polite"
            className={`text-sm ${state.status === "error" ? "text-rose-300" : "text-ink-muted"}`}
          >
            {state.status === "error" ? state.message : <span className="font-mono text-xs">{messageLength} / 5000</span>}
          </p>
          <button
            type="submit"
            disabled={pending}
            data-cursor="Send"
            className="group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet-glow to-cyan-glow px-8 py-3.5 text-sm font-semibold text-midnight-950 shadow-[0_10px_40px_-10px_rgb(139_92_246/0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-10px_rgb(34_211_238/0.8)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition duration-700 group-hover:translate-x-full" />
            {pending ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-midnight-950/30 border-t-midnight-950" />
                Sending…
              </>
            ) : (
              <>
                Send message
                <SendIcon width={16} height={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
