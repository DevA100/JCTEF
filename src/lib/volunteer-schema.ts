import { z } from "zod";
import { frameworkStages, volunteerAvailability, volunteerRoles } from "./content";

/**
 * Volunteer application rules, shared by the browser (instant feedback) and
 * the Server Action (the real check). Text is stripped of HTML tags and
 * trimmed before the length limits are checked.
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

const stageTitles = frameworkStages.map((stage) => stage.title) as [string, ...string[]];

export const volunteerSchema = z
  .object({
    firstName: clean(60).pipe(z.string().min(1, "Please enter your first name.")),
    lastName: clean(60).pipe(z.string().min(1, "Please enter your last name.")),
    email: z.string().trim().pipe(z.email("Please enter a valid email address, like name@example.com.").max(200)),
    /** E.164 from CruisePhoneInput's hidden field, e.g. +2348031234567. */
    phone: z
      .string()
      .trim()
      .regex(/^(\+\d{8,15})?$/, "Please enter a valid phone number.")
      .optional()
      .transform((s) => s || undefined),
    location: optional(100),
    role: z.enum(volunteerRoles, "Please choose how you'd like to volunteer."),
    areas: z.array(z.enum(stageTitles)).max(stageTitles.length).default([]),
    availability: z
      .union([z.enum(volunteerAvailability), z.literal("")])
      .optional()
      .transform((s) => s || undefined),
    experience: optional(1500),
    message: clean(2000).pipe(z.string().min(20, "Please tell us a little more (at least 20 characters).")),
    consentContact: z.literal("on", "Please agree so we can contact you about your application."),
    consentAge: z.literal("on", "Please confirm you are 18 or older."),
  })
  // Areas only apply to programme facilitators.
  .transform((data) => ({ ...data, areas: data.role === "Programme facilitator" ? data.areas : [] }));

export type VolunteerInput = z.input<typeof volunteerSchema>;
export type VolunteerApplication = z.output<typeof volunteerSchema>;
export type VolunteerField = keyof VolunteerInput;

/** Reads the form into the shape the schema expects. */
export function readVolunteerForm(formData: FormData): Record<string, unknown> {
  const get = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : undefined;
  };
  return {
    firstName: get("firstName") ?? "",
    lastName: get("lastName") ?? "",
    email: get("email") ?? "",
    phone: get("phone"),
    location: get("location"),
    role: get("role"),
    areas: formData.getAll("areas").filter((v): v is string => typeof v === "string"),
    availability: get("availability"),
    experience: get("experience"),
    message: get("message") ?? "",
    consentContact: get("consentContact"),
    consentAge: get("consentAge"),
  };
}

/** First error message per field. */
export function volunteerErrors(error: z.ZodError): Partial<Record<VolunteerField, string>> {
  const fields = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  return Object.fromEntries(Object.entries(fields).map(([key, messages]) => [key, messages?.[0]]));
}
