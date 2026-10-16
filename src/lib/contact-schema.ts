import { z } from "zod";

const singleLine = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be at most ${max} characters.`)
    .refine((value) => !/[\r\n]/.test(value), `${label} must be a single line.`);

export const contactSchema = z.object({
  name: singleLine("Name", 2, 100),
  email: z.string().trim().max(254, "Email is too long.").pipe(z.email("Enter a valid email address.")),
  subject: z
    .string()
    .trim()
    .max(150, "Subject must be at most 150 characters.")
    .refine((value) => !/[\r\n]/.test(value), "Subject must be a single line."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message must be at most 5000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export {
  emptyContactValues,
  initialContactState,
  type ContactField,
  type ContactFormState,
} from "./contact-state";
