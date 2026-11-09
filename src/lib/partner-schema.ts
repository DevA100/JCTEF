import { z } from "zod";

// No eval-based speed-ups: keeps the Content Security Policy free of 'unsafe-eval'.
z.config({ jitless: true });
import { allPartnerAreas, partnerOrgTypes } from "./content";

/**
 * Partnership enquiry rules, shared by the browser (instant feedback) and the
 * Server Action (the real check). Text is stripped of HTML and trimmed before
 * the length limits are checked.
 */
const clean = (max: number) =>
  z
    .string()
    .transform((s) =>
      s
        .replace(/<[^>]*>/g, "")
        .replace(/\s+\n/g, "\n")
        .trim(),
    )
    .pipe(z.string().max(max, `Please keep this under ${max.toLocaleString("en-GB")} characters.`));

const optional = (max: number) =>
  clean(max)
    .optional()
    .transform((s) => s || undefined);

/** Accepts "jctef.org", "www.jctef.org" or a full http(s) address. */
const website = z
  .string()
  .trim()
  .max(200, "Please keep this under 200 characters.")
  .optional()
  .transform((s) => (s ? (/^https?:\/\//i.test(s) ? s : `https://${s}`) : undefined))
  .refine((s) => {
    if (!s) return true;
    try {
      const url = new URL(s);
      return /^https?:$/.test(url.protocol) && url.hostname.includes(".");
    } catch {
      return false;
    }
  }, "Please enter a website or LinkedIn address, e.g. jctef.org or linkedin.com/company/…");

/** Every field the form sends (anything else is rejected on the server). */
export const PARTNER_FIELDS = [
  "fullName", "organisation", "role", "email", "phone", "orgType", "areas", "orgWebsite", "message", "consent",
] as const;

export const partnerSchema = z.strictObject({
  fullName: clean(120).pipe(z.string().min(2, "Please enter your full name.")),
  organisation: clean(150).pipe(z.string().min(2, "Please enter your organisation's name.")),
  role: optional(100),
  email: z.string().trim().pipe(z.email("Please enter a valid email address, like name@example.com.").max(200)),
  /** E.164 from CruisePhoneInput's hidden field, e.g. +2348031234567. */
  phone: z
    .string()
    .trim()
    .regex(/^(\+\d{8,15})?$/, "Please enter a valid phone number.")
    .optional()
    .transform((s) => s || undefined),
  orgType: z.enum(partnerOrgTypes, "Please choose your organisation type."),
  areas: z
    .array(z.enum(allPartnerAreas as [string, ...string[]]))
    .max(allPartnerAreas.length)
    .default([]),
  website,
  message: clean(3000).pipe(z.string().min(30, "Please tell us a little more (at least 30 characters).")),
  consent: z.literal("on", "Please agree so we can contact you about this enquiry."),
});

export type PartnerInput = z.input<typeof partnerSchema>;
export type PartnerEnquiry = z.output<typeof partnerSchema>;
export type PartnerField = keyof PartnerInput;

export function readPartnerForm(formData: FormData): Record<string, unknown> {
  const get = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : undefined;
  };
  return {
    fullName: get("fullName") ?? "",
    organisation: get("organisation") ?? "",
    role: get("role"),
    email: get("email") ?? "",
    phone: get("phone"),
    orgType: get("orgType") || undefined,
    areas: formData.getAll("areas").filter((v): v is string => typeof v === "string"),
    website: get("orgWebsite"),
    message: get("message") ?? "",
    consent: get("consent"),
  };
}

export function partnerErrors(error: z.ZodError): Partial<Record<PartnerField, string>> {
  const fields = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  return Object.fromEntries(Object.entries(fields).map(([key, messages]) => [key, messages?.[0]]));
}
