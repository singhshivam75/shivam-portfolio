/** Form state shared with the client. Kept free of zod so the validator stays server-side. */
export type ContactField = "name" | "email" | "subject" | "message";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<ContactField, string>>;
  values: Record<ContactField, string>;
}

export const emptyContactValues: Record<ContactField, string> = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export const initialContactState: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: emptyContactValues,
};
