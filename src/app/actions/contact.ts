"use server";

import "server-only";
import { after } from "next/server";
import { z } from "zod";
import { BrevoError, brevo, missingEnv } from "@/lib/brevo";
import { contactEmail } from "@/lib/emails/contact-email";
import { site } from "@/lib/content";
import { guardMessage, guardSubmission } from "@/lib/form-guard";
import { optionalPhone, plainText } from "@/lib/form-text";
import { appendToSheet } from "@/lib/sheets";

const FIELDS = ["name", "email", "phone", "message"] as const;

const schema = z.strictObject({
  name: plainText(100).pipe(z.string().min(1, "Please enter your name.")),
  email: z.email("Please enter a valid email address, like name@example.com.").max(200),
  phone: optionalPhone,
  message: plainText(2000).pipe(z.string().min(1, "Please write a message.")),
});

type Field = "name" | "email" | "message";
export type ContactState = {
  status: "idle" | "success" | "error";
  /** Increments on every submit, so the form can reset fields per result. */
  id: number;
  message?: string;
  errors?: Partial<Record<Field, string>>;
  values?: { name: string; email: string; phone?: string; message: string };
};

export async function sendContactMessage(prev: ContactState, formData: FormData): Promise<ContactState> {
  const id = prev.id + 1;
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "") || undefined,
    message: String(formData.get("message") ?? ""),
  };
  const values = { name: raw.name, email: raw.email, phone: raw.phone, message: raw.message };

  // Honeypot: people never see this field, bots fill it in. Pretend it worked.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", id, message: "Thank you. Your message has been sent." };
  }

  const guard = await guardSubmission("Contact", formData, FIELDS);
  if (!guard.ok) return { status: "error", id, message: guardMessage(guard.reason, site.email), values };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fields = z.flattenError(parsed.error).fieldErrors;
    return {
      status: "error",
      id,
      message: "Please check the highlighted fields.",
      errors: { name: fields.name?.[0], email: fields.email?.[0], message: fields.message?.[0] },
      values,
    };
  }

  // Copy to the Google Sheet once the response is sent. Never fails the form.
  const { name, email, phone, message } = parsed.data;
  after(() => appendToSheet("contact", { Name: name, Email: email, Phone: phone, Message: message }));

  const missing = missingEnv("BREVO_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL");
  if (missing.length > 0) {
    console.error(`Contact form is not set up: missing ${missing.join(", ")} (see .env.example).`);
    return { status: "error", id, message: `Our form is not working right now. Please email us at ${site.email}.`, values };
  }

  const mail = contactEmail({ name, email, phone, message });

  try {
    await brevo("/smtp/email", {
      method: "POST",
      body: {
        sender: { name: "JCTEF website", email: process.env.CONTACT_FROM_EMAIL },
        to: [{ email: process.env.CONTACT_TO_EMAIL, name: "JCTEF" }],
        replyTo: { email, name: name.slice(0, 70) },
        subject: mail.subject,
        textContent: mail.text,
        htmlContent: mail.html,
      },
    });
  } catch (error) {
    console.error("Contact form: Brevo send failed", error instanceof BrevoError ? `${error.status} ${error.code}` : error);
    return {
      status: "error",
      id,
      message: `Sorry, your message could not be sent. Please try again, or email us at ${site.email}.`,
      values,
    };
  }

  return { status: "success", id, message: "Thank you. Your message has been sent and we will reply by email." };
}
