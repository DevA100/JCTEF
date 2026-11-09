"use server";

import "server-only";
import { after } from "next/server";
import { BrevoError, brevo, missingEnv } from "@/lib/brevo";
import { site } from "@/lib/content";
import { renderEmailTemplate } from "@/lib/emails/render-template";
import { PARTNER_FIELDS, type PartnerField, partnerErrors, partnerSchema, readPartnerForm } from "@/lib/partner-schema";
import { partnershipEmail } from "@/lib/partnership";
import { guardMessage, guardSubmission } from "@/lib/form-guard";
import { appendToSheet } from "@/lib/sheets";

export type PartnerState = {
  status: "idle" | "success" | "invalid" | "error";
  /** Increments on every submit, so the form reacts to each result once. */
  id: number;
  firstName?: string;
  /** Shown instead of the usual error text (e.g. rate limit, security check). */
  message?: string;
  errors?: Partial<Record<PartnerField, string>>;
  /** What the person typed, so nothing is lost on an error. */
  values?: Record<string, unknown>;
};

const describe = (error: unknown) =>
  error instanceof BrevoError ? `${error.status} ${error.code ?? ""} ${error.message}` : error;

/**
 * Partnership enquiry:
 * 1. Team alert (emails/brevo/partner-team-alert.html) to PARTNER_TO_EMAIL,
 *    reply-to the enquirer. If this fails, the submission fails.
 * 2. Confirmation to the enquirer (emails/brevo/partner-received.html). Logged only.
 * 3. Enquirer added or updated in BREVO_PARTNER_LIST_ID. Logged only.
 */
export async function submitPartnerEnquiry(prev: PartnerState, formData: FormData): Promise<PartnerState> {
  const id = prev.id + 1;
  const raw = readPartnerForm(formData);
  const firstOf = (name: unknown) =>
    String(name ?? "")
      .trim()
      .split(/\s+/)[0] ?? "";

  // Honeypot: hidden from people, filled in by bots. Pretend it worked.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", id, firstName: firstOf(raw.fullName) };
  }

  const guard = await guardSubmission("Partnership", formData, PARTNER_FIELDS);
  if (!guard.ok) return { status: "error", id, message: guardMessage(guard.reason, partnershipEmail()), values: raw };

  const parsed = partnerSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "invalid", id, errors: partnerErrors(parsed.error), values: raw };
  }
  const e = parsed.data;

  // Copy to the Google Sheet once the response is sent. Never fails the form.
  after(() =>
    appendToSheet("partner", {
      "Full name": e.fullName,
      Organisation: e.organisation,
      Role: e.role,
      Email: e.email,
      Phone: e.phone,
      "Organisation type": e.orgType,
      "Areas of interest": e.areas,
      Website: e.website,
      Message: e.message,
    }),
  );

  const missing = missingEnv("BREVO_API_KEY", "CONTACT_FROM_EMAIL");
  if (missing.length > 0) {
    // Names only, never values.
    console.error(`Partnership form is not set up: missing ${missing.join(", ")} (see .env.example).`);
    return { status: "error", id, values: raw };
  }
  const sender = process.env.CONTACT_FROM_EMAIL!.trim();
  const teamEmail = partnershipEmail();

  const [firstName, ...rest] = e.fullName.split(/\s+/);
  const lastName = rest.join(" ");
  const params = {
    FIRSTNAME: firstName,
    FULLNAME: e.fullName,
    EMAIL: e.email,
    PHONE: e.phone ?? "",
    ORGANISATION: e.organisation,
    ROLE: e.role ?? "",
    ORG_TYPE: e.orgType,
    AREAS: e.areas.join(", "),
    WEBSITE: e.website ?? "",
    MESSAGE: e.message,
    SUBMITTED_AT: new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Africa/Lagos",
    }).format(new Date()),
  };

  let teamHtml: string, enquirerHtml: string;
  try {
    teamHtml = renderEmailTemplate("partner-team-alert", params);
    enquirerHtml = renderEmailTemplate("partner-received", params);
  } catch (error) {
    console.error("Partnership form: could not read the email templates:", error);
    return { status: "error", id, values: raw };
  }
  const details = [
    `Name: ${e.fullName}${e.role ? ` (${e.role})` : ""}`,
    `Organisation: ${e.organisation}`,
    `Type: ${e.orgType}`,
    `Email: ${e.email}`,
    `Phone: ${e.phone ?? "Not given"}`,
    ...(e.areas.length ? [`Areas of interest: ${params.AREAS}`] : []),
    ...(e.website ? [`Website: ${e.website}`] : []),
    `Submitted: ${params.SUBMITTED_AT}`,
  ];

  // 1. Team alert: required.
  try {
    await brevo("/smtp/email", {
      method: "POST",
      body: {
        sender: { name: "JCTEF website", email: sender },
        to: [{ email: teamEmail, name: "JCTEF partnerships" }],
        replyTo: { email: e.email, name: e.fullName.slice(0, 70) },
        subject: `New partnership enquiry: ${e.organisation} (${e.orgType})`.slice(0, 150),
        htmlContent: teamHtml,
        textContent: [
          "New partnership enquiry from jctef.org",
          "",
          ...details,
          "",
          e.message,
          "",
          `Reply to this email to respond to ${firstName} directly.`,
        ].join("\n"),
      },
    });
  } catch (error) {
    console.error("Partnership form: team alert failed:", describe(error));
    return { status: "error", id, values: raw };
  }

  // 2 and 3 run together; neither can fail the submission.
  const listId = Number(process.env.BREVO_PARTNER_LIST_ID);
  const [confirm, contact] = await Promise.allSettled([
    brevo("/smtp/email", {
      method: "POST",
      body: {
        sender: { name: "JCTEF", email: sender },
        to: [{ email: e.email, name: e.fullName.slice(0, 70) }],
        replyTo: { email: teamEmail, name: "JCTEF partnerships" },
        subject: "We've received your partnership enquiry",
        htmlContent: enquirerHtml,
        textContent: [
          `Hi ${firstName},`,
          "",
          "Thank you for your interest in partnering with JCTEF. Our partnerships team will review your enquiry and get back to you.",
          "",
          ...details.filter((line) => /^(Organisation|Type|Areas|Submitted)/.test(line)),
          "",
          `Learn about our programmes: ${site.url}/programmes`,
        ].join("\n"),
      },
    }),
    Number.isInteger(listId) && listId > 0
      ? brevo("/contacts", {
          method: "POST",
          body: {
            email: e.email,
            listIds: [listId],
            updateEnabled: true,
            attributes: {
              FIRSTNAME: firstName,
              ...(lastName ? { LASTNAME: lastName } : {}),
              COMPANY: e.organisation,
              ...(e.phone ? { SMS: e.phone } : {}),
              ORG_TYPE: e.orgType,
            },
          },
        })
      : Promise.reject(new Error("BREVO_PARTNER_LIST_ID is not set")),
  ]);
  if (confirm.status === "rejected") console.error("Partnership form: enquirer confirmation failed:", describe(confirm.reason));
  if (contact.status === "rejected") console.error("Partnership form: saving the contact failed:", describe(contact.reason));

  return { status: "success", id, firstName };
}
