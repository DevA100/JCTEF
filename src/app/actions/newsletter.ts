"use server";

import { z } from "zod";
import { BrevoError, brevo, brevoConfigured } from "@/lib/brevo";
import { site } from "@/lib/content";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  firstName: z.string().trim().max(60).optional(),
  email: z.email("Please enter a valid email address, like name@example.com.").max(200),
  consent: z.literal("on", "Please tick the box to agree to receive our updates."),
});

export type NewsletterState = {
  status: "idle" | "confirm" | "subscribed" | "already" | "error";
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

  if (!(await rateLimit("newsletter", { limit: 5, windowMs: 15 * 60_000 }))) {
    return { status: "error", id, message: "Too many attempts. Please wait a few minutes and try again." };
  }

  const parsed = schema.safeParse({
    firstName: String(formData.get("firstName") ?? "") || undefined,
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

  if (!brevoConfigured("BREVO_LIST_ID")) {
    console.error("Newsletter: BREVO_API_KEY or BREVO_LIST_ID is not set.");
    return { status: "error", id, message: "Sign-ups are not working right now. Please try again later." };
  }

  const { email, firstName } = parsed.data;
  const listId = Number(process.env.BREVO_LIST_ID);
  const attributes = firstName ? { FIRSTNAME: firstName } : undefined;

  try {
    // Already on the list? Say so rather than sending another email.
    const existing = await brevo<{ listIds?: number[] }>(`/contacts/${encodeURIComponent(email)}`).catch((error) => {
      if (error instanceof BrevoError && error.status === 404) return null;
      throw error;
    });
    if (existing?.listIds?.includes(listId)) {
      return { status: "already", id, message: "You are already subscribed. Thank you for following our work." };
    }

    // Double opt-in when a confirmation template is set up (recommended).
    const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
    if (templateId) {
      await brevo("/contacts/doubleOptinConfirmation", {
        method: "POST",
        body: {
          email,
          includeListIds: [listId],
          templateId,
          redirectionUrl: process.env.BREVO_DOI_REDIRECT_URL || `${site.url}/newsletter/confirmed`,
          attributes,
        },
      });
      return {
        status: "confirm",
        id,
        message: "Almost done. Check your inbox and click the link in our email to confirm your subscription.",
      };
    }

    // Single opt-in fallback.
    await brevo("/contacts", {
      method: "POST",
      body: { email, attributes, listIds: [listId], updateEnabled: true },
    });
    return { status: "subscribed", id, message: "You are subscribed. Thank you for following our work." };
  } catch (error) {
    if (error instanceof BrevoError && error.code === "duplicate_parameter") {
      return { status: "already", id, message: "You are already subscribed. Thank you for following our work." };
    }
    console.error("Newsletter: Brevo request failed", error instanceof BrevoError ? `${error.status} ${error.code}` : error);
    return { status: "error", id, message: "Sorry, we could not sign you up just now. Please try again later." };
  }
}
