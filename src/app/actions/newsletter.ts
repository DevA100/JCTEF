"use server";

import "server-only";
import { z } from "zod";
import { BrevoError, brevo, missingEnv } from "@/lib/brevo";
import { site } from "@/lib/content";
import { guardMessage, guardSubmission } from "@/lib/form-guard";
import { optionalPlainText } from "@/lib/form-text";

const FIELDS = ["firstName", "lastName", "email", "consent"] as const;

const schema = z.strictObject({
  firstName: optionalPlainText(60),
  lastName: optionalPlainText(60),
  email: z.email("Please enter a valid email address, like name@example.com.").max(200),
  consent: z.literal("on", "Please tick the box to agree to receive our updates."),
});

export type NewsletterState = {
  status: "idle" | "confirm" | "already" | "error";
  /** Increments on every submit so the form can show a toast each time. */
  id: number;
  message?: string;
  errors?: { email?: string; consent?: string };
};

export async function subscribeToNewsletter(prev: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const id = prev.id + 1;

  // Honeypot: hidden from people, filled in by bots.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "confirm", id };
  }

  const guard = await guardSubmission("Newsletter", formData, FIELDS);
  if (!guard.ok) return { status: "error", id, message: guardMessage(guard.reason, site.email) };

  const parsed = schema.safeParse({
    firstName: String(formData.get("firstName") ?? "") || undefined,
    lastName: String(formData.get("lastName") ?? "") || undefined,
    email: String(formData.get("email") ?? "").trim(),
    consent: formData.get("consent") ?? undefined,
  });
  if (!parsed.success) {
    const fields = z.flattenError(parsed.error).fieldErrors;
    return {
      status: "error",
      id,
      message: "Please check the form and try again.",
      errors: { email: fields.email?.[0], consent: fields.consent?.[0] },
    };
  }

  const missing = missingEnv("BREVO_API_KEY", "BREVO_LIST_ID", "BREVO_DOI_TEMPLATE_ID");
  const listId = Number(process.env.BREVO_LIST_ID);
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const badNumber = [
    !Number.isInteger(listId) || listId <= 0 ? "BREVO_LIST_ID" : null,
    !Number.isInteger(templateId) || templateId <= 0 ? "BREVO_DOI_TEMPLATE_ID" : null,
  ].filter((name): name is string => name !== null && !missing.includes(name));
  if (missing.length > 0 || badNumber.length > 0) {
    // Names only, never values.
    const problems = [
      ...(missing.length > 0 ? [`missing ${missing.join(", ")}`] : []),
      ...(badNumber.length > 0 ? [`${badNumber.join(" and ")} must be a number, e.g. 3`] : []),
    ];
    console.error(`Newsletter is not set up: ${problems.join("; ")} (see .env.example).`);
    return {
      status: "error",
      id,
      message: `Sign-ups aren't working right now. Please try again later, or email us at ${site.email} to join the list.`,
    };
  }

  const { email, firstName, lastName } = parsed.data;
  // Brevo's built-in contact attributes; FIRSTNAME feeds the template's greeting.
  const attributes = {
    ...(firstName ? { FIRSTNAME: firstName } : {}),
    ...(lastName ? { LASTNAME: lastName } : {}),
  };
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "");

  try {
    // Already on the list? Say so rather than sending another email.
    const existing = await brevo<{ listIds?: number[] }>(`/contacts/${encodeURIComponent(email)}`).catch((error) => {
      if (error instanceof BrevoError && error.status === 404) return null;
      throw error;
    });
    if (existing?.listIds?.includes(listId)) return ALREADY(id);

    // Double opt-in: Brevo emails a confirmation link (template in
    // emails/brevo/confirm-subscription.html) and only adds the contact to the
    // list once it is clicked. Docs: https://developers.brevo.com/reference/create-doi-contact
    await brevo("/contacts/doubleOptinConfirmation", {
      method: "POST",
      body: {
        email,
        includeListIds: [listId],
        templateId,
        redirectionUrl: `${siteUrl}/newsletter/confirmed`,
        ...(Object.keys(attributes).length > 0 ? { attributes } : {}),
      },
    });
    return {
      status: "confirm",
      id,
      message: "Almost there! Check your inbox and click the link to confirm your subscription.",
    };
  } catch (error) {
    if (error instanceof BrevoError && (error.code === "duplicate_parameter" || error.code === "duplicate_request")) {
      return ALREADY(id);
    }
    // Status, code and Brevo's message only: the API key is never logged.
    console.error(
      "Newsletter: Brevo request failed:",
      error instanceof BrevoError ? `${error.status} ${error.code ?? ""} ${error.message}` : error,
    );
    return {
      status: "error",
      id,
      message: `Sorry, we couldn't sign you up just now. Please try again in a few minutes, or email us at ${site.email}.`,
    };
  }
}

const ALREADY = (id: number): NewsletterState => ({
  status: "already",
  id,
  message: "You're already on our list. Thank you!",
});
