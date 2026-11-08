"use server";

import { z } from "zod";
import { BrevoError, brevo, brevoConfigured, escapeHtml } from "@/lib/brevo";
import { site } from "@/lib/content";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Please keep your name under 100 characters."),
  email: z.email("Please enter a valid email address, like name@example.com.").max(200),
  phone: z.string().trim().max(20).optional(),
  message: z
    .string()
    .trim()
    .min(1, "Please write a message.")
    .max(2000, "Please keep your message under 2,000 characters."),
});

type Field = "name" | "email" | "message";
export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<Field, string>>;
  values?: { name: string; email: string; message: string };
};

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "") || undefined,
    message: String(formData.get("message") ?? ""),
  };
  const values = { name: raw.name, email: raw.email, message: raw.message };

  // Honeypot: people never see this field, bots fill it in. Pretend it worked.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", message: "Thank you. Your message has been sent." };
  }

  if (!(await rateLimit("contact", { limit: 5, windowMs: 15 * 60_000 }))) {
    return {
      status: "error",
      message: `You have sent several messages in a short time. Please wait a few minutes, or email us at ${site.email}.`,
      values,
    };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fields = z.flattenError(parsed.error).fieldErrors;
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors: { name: fields.name?.[0], email: fields.email?.[0], message: fields.message?.[0] },
      values,
    };
  }

  if (!brevoConfigured("CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL")) {
    console.error("Contact form: BREVO_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL is not set.");
    return { status: "error", message: `Our form is not working right now. Please email us at ${site.email}.`, values };
  }

  const { name, email, phone, message } = parsed.data;
  const lines = [`Name: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : null].filter(Boolean) as string[];

  try {
    await brevo("/smtp/email", {
      method: "POST",
      body: {
        sender: { name: "JCTEF website", email: process.env.CONTACT_FROM_EMAIL },
        to: [{ email: process.env.CONTACT_TO_EMAIL, name: "JCTEF" }],
        replyTo: { email, name: name.slice(0, 70) },
        subject: `Website enquiry from ${name}`.slice(0, 150),
        textContent: `${message}\n\n---\n${lines.join("\n")}\n\nSent from the contact form on ${site.url}/contact. Reply to this email to answer ${name}.`,
        htmlContent: `<p style="white-space:pre-wrap">${escapeHtml(message)}</p><hr><p>${lines.map(escapeHtml).join("<br>")}</p><p style="color:#666">Sent from the contact form on ${site.url}/contact. Reply to this email to answer ${escapeHtml(name)}.</p>`,
      },
    });
  } catch (error) {
    console.error("Contact form: Brevo send failed", error instanceof BrevoError ? `${error.status} ${error.code}` : error);
    return {
      status: "error",
      message: `Sorry, your message could not be sent. Please try again, or email us at ${site.email}.`,
      values,
    };
  }

  return { status: "success", message: "Thank you. Your message has been sent and we will reply by email." };
}
