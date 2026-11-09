import { z } from "zod";

// No eval-based speed-ups: keeps the Content Security Policy free of 'unsafe-eval'.
z.config({ jitless: true });

/**
 * Plain-text form fields: HTML tags removed, whitespace trimmed, then the
 * length limit checked. Used by every form, so nothing sent to Brevo, the
 * Google Sheet or our emails can carry markup.
 */
export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+\n/g, "\n")
    .trim();
}

export const plainText = (max: number) =>
  z
    .string()
    .transform(stripHtml)
    .pipe(z.string().max(max, `Please keep this under ${max.toLocaleString("en-GB")} characters.`));

export const optionalPlainText = (max: number) =>
  plainText(max)
    .optional()
    .transform((s) => s || undefined);

/** E.164 from CruisePhoneInput's hidden field, e.g. +2348031234567. */
export const optionalPhone = z
  .string()
  .trim()
  .regex(/^(\+\d{8,15})?$/, "Please enter a valid phone number.")
  .optional()
  .transform((s) => s || undefined);
