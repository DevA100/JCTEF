"use server";

import "server-only";
import { after } from "next/server";
import { BrevoError, brevo, missingEnv } from "@/lib/brevo";
import { site } from "@/lib/content";
import { renderEmailTemplate } from "@/lib/emails/render-template";
import { guardMessage, guardSubmission } from "@/lib/form-guard";
import { appendToSheet } from "@/lib/sheets";
import { VOLUNTEER_FIELDS, type VolunteerField, readVolunteerForm, volunteerErrors, volunteerSchema } from "@/lib/volunteer-schema";

export type VolunteerState = {
  status: "idle" | "success" | "invalid" | "error";
  /** Increments on every submit, so the form reacts to repeat results. */
  id: number;
  firstName?: string;
  email?: string;
  /** Shown instead of the usual error text (e.g. rate limit, security check). */
  message?: string;
  errors?: Partial<Record<VolunteerField, string>>;
  /** What the person typed, so nothing is lost on an error. */
  values?: Record<string, unknown>;
};

const describe = (error: unknown) =>
  error instanceof BrevoError ? `${error.status} ${error.code ?? ""} ${error.message}` : error;

/**
 * Volunteer application:
 * 1. Team alert (emails/brevo/volunteer-team-alert.html) to VOLUNTEER_TO_EMAIL,
 *    reply-to the applicant. If this fails, the submission fails.
 * 2. Confirmation to the applicant (emails/brevo/volunteer-received.html),
 *    reply-to info@. Failure is logged only.
 * 3. Applicant added or updated as a contact in BREVO_VOLUNTEER_LIST_ID.
 *    Failure is logged only.
 * The HTML files are rendered on the server (src/lib/emails/render-template.ts).
 */
export async function submitVolunteerApplication(prev: VolunteerState, formData: FormData): Promise<VolunteerState> {
  const id = prev.id + 1;
  const raw = readVolunteerForm(formData);

  // Honeypot: hidden from people, filled in by bots. Pretend it worked.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", id, firstName: String(raw.firstName), email: String(raw.email) };
  }

  const guard = await guardSubmission("Volunteer", formData, VOLUNTEER_FIELDS);
  if (!guard.ok) return { status: "error", id, message: guardMessage(guard.reason, site.email), values: raw };

  const parsed = volunteerSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "invalid", id, errors: volunteerErrors(parsed.error), values: raw };
  }
  const a = parsed.data;

  // Copy to the Google Sheet once the response is sent. Never fails the form.
  after(() =>
    appendToSheet("volunteer", {
      "First name": a.firstName,
      "Last name": a.lastName,
      Email: a.email,
      Phone: a.phone,
      Location: a.location,
      "Volunteering as": a.role,
      "Facilitation areas": a.areas,
      Availability: a.availability,
      Experience: a.experience,
      Motivation: a.message,
    }),
  );

  const missing = missingEnv("BREVO_API_KEY", "CONTACT_FROM_EMAIL");
  if (missing.length > 0) {
    // Names only, never values.
    console.error(`Volunteer form is not set up: missing ${missing.join(", ")} (see .env.example).`);
    return { status: "error", id, values: raw };
  }
  const sender = process.env.CONTACT_FROM_EMAIL!.trim();

  const fullName = `${a.firstName} ${a.lastName}`;
  const params = {
    FIRSTNAME: a.firstName,
    FULLNAME: fullName,
    EMAIL: a.email,
    PHONE: a.phone ?? "",
    LOCATION: a.location ?? "",
    ROLE: a.role,
    AREAS: a.areas.join(", "),
    AVAILABILITY: a.availability ?? "",
    EXPERIENCE: a.experience ?? "",
    MESSAGE: a.message,
    SUBMITTED_AT: new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Africa/Lagos",
    }).format(new Date()),
  };
  const teamEmail = process.env.VOLUNTEER_TO_EMAIL?.trim() || site.email;

  // Rendered here from emails/brevo/*.html: no Brevo templates needed.
  let teamHtml: string, applicantHtml: string;
  try {
    teamHtml = renderEmailTemplate("volunteer-team-alert", params);
    applicantHtml = renderEmailTemplate("volunteer-received", params);
  } catch (error) {
    console.error("Volunteer form: could not read the email templates:", error);
    return { status: "error", id, values: raw };
  }
  const details = [
    `Name: ${fullName}`,
    `Email: ${a.email}`,
    `Phone: ${a.phone ?? "Not given"}`,
    `Location: ${a.location ?? "Not given"}`,
    `Role: ${a.role}`,
    ...(a.areas.length ? [`Areas: ${params.AREAS}`] : []),
    `Availability: ${a.availability ?? "Not given"}`,
    `Submitted: ${params.SUBMITTED_AT}`,
  ];

  // 1. Team alert: required.
  try {
    await brevo("/smtp/email", {
      method: "POST",
      body: {
        sender: { name: "JCTEF website", email: sender },
        to: [{ email: teamEmail, name: "JCTEF" }],
        replyTo: { email: a.email, name: fullName.slice(0, 70) },
        subject: `New volunteer application: ${fullName} (${a.role})`.slice(0, 150),
        htmlContent: teamHtml,
        textContent: [
          "New volunteer application from jctef.org",
          "",
          ...details,
          "",
          `Experience: ${a.experience ?? "Not given"}`,
          "",
          `Why they want to volunteer: ${a.message}`,
          "",
          `Reply to this email to respond to ${a.firstName} directly.`,
        ].join("\n"),
      },
    });
  } catch (error) {
    console.error("Volunteer form: team alert failed:", describe(error));
    return { status: "error", id, values: raw };
  }

  // 2 and 3 run together; neither can fail the submission.
  const listId = Number(process.env.BREVO_VOLUNTEER_LIST_ID);
  const [confirm, contact] = await Promise.allSettled([
    brevo("/smtp/email", {
      method: "POST",
      body: {
        sender: { name: "JCTEF", email: sender },
        to: [{ email: a.email, name: fullName.slice(0, 70) }],
        replyTo: { email: site.email, name: "JCTEF" },
        subject: "We've received your volunteer application",
        htmlContent: applicantHtml,
        textContent: [
          `Hi ${a.firstName},`,
          "",
          "Thank you for applying to volunteer with JCTEF. We've received your application and will get back to you by email.",
          "",
          ...details.filter((line) => /^(Role|Areas|Availability|Submitted)/.test(line)),
          "",
          `Questions? Reply to this email or write to ${site.email}.`,
        ].join("\n"),
      },
    }),
    Number.isInteger(listId) && listId > 0
      ? brevo("/contacts", {
          method: "POST",
          body: {
            email: a.email,
            listIds: [listId],
            updateEnabled: true,
            attributes: {
              FIRSTNAME: a.firstName,
              LASTNAME: a.lastName,
              ...(a.phone ? { SMS: a.phone } : {}),
              VOLUNTEER_ROLE: a.role,
            },
          },
        })
      : Promise.reject(new Error("BREVO_VOLUNTEER_LIST_ID is not set")),
  ]);
  if (confirm.status === "rejected") console.error("Volunteer form: applicant confirmation failed:", describe(confirm.reason));
  if (contact.status === "rejected") console.error("Volunteer form: saving the contact failed:", describe(contact.reason));

  return { status: "success", id, firstName: a.firstName, email: a.email };
}
