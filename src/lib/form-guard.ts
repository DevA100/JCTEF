import "server-only";
import { headers } from "next/headers";
import { rateLimit } from "./rate-limit";
import { TURNSTILE_ERROR_FIELD, TURNSTILE_FIELD, TURNSTILE_STATUS_FIELD, verifyTurnstile } from "./turnstile";

/**
 * Checks every form submission must pass before its answers are looked at.
 * Run after the honeypot check and before validation.
 *
 * 1. Origin: the request must come from a page on this site. Next.js already
 *    rejects a mismatched Origin, but lets a missing one through; we don't.
 * 2. Fields: only the form's own fields (plus the honeypot, the Turnstile
 *    fields and React's internal $ACTION fields) are accepted.
 * 3. Rate limit: 5 submissions per IP per form every 10 minutes.
 * 4. Turnstile (src/lib/turnstile.ts). A rejected token is refused. An
 *    unverified submission (the widget couldn't load, Cloudflare was down,
 *    or no token at all) is accepted, but only 2 per IP per form per hour,
 *    and the team alert says it wasn't verified.
 * The honeypot and the zod validation in each action apply to everything.
 *
 * Failures are logged on the server; the person only sees a generic message.
 */
export type GuardFailure = "origin" | "fields" | "rate" | "rate-unverified" | "captcha";

/** Hosts allowed besides the site's own host (which covers deploy previews). */
const SITE_HOSTS = ["jctef.org", "www.jctef.org"];
const ALWAYS_ALLOWED = new Set(["website", TURNSTILE_FIELD, TURNSTILE_STATUS_FIELD, TURNSTILE_ERROR_FIELD]);

export const RATE_LIMIT = { limit: 5, windowMs: 10 * 60_000 };
/** For submissions Turnstile couldn't verify. */
export const UNVERIFIED_RATE_LIMIT = { limit: 2, windowMs: 60 * 60_000 };

export async function clientIp(): Promise<string> {
  const h = await headers();
  // Netlify sets x-nf-client-connection-ip itself; it can't be spoofed by the client.
  return (
    h.get("x-nf-client-connection-ip")?.trim() ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

async function sameOrigin(): Promise<boolean> {
  const h = await headers();
  const origin = h.get("origin");
  if (!origin) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0]?.trim();
  return originHost === host || SITE_HOSTS.includes(originHost);
}

export function unexpectedFields(formData: FormData, allowed: readonly string[]): string[] {
  const known = new Set(allowed);
  const extra = new Set<string>();
  for (const key of formData.keys()) {
    if (known.has(key) || ALWAYS_ALLOWED.has(key) || key.startsWith("$ACTION")) continue;
    extra.add(key);
  }
  return [...extra];
}

export async function guardSubmission(
  form: string,
  formData: FormData,
  allowedFields: readonly string[],
): Promise<{ ok: true; verified: boolean } | { ok: false; reason: GuardFailure }> {
  if (!(await sameOrigin())) {
    console.warn(`${form} form: rejected a request from another origin (or with no Origin header).`);
    return { ok: false, reason: "origin" };
  }

  const extra = unexpectedFields(formData, allowedFields);
  if (extra.length > 0) {
    // Field names only (capped), never values.
    console.warn(`${form} form: rejected unexpected fields: ${extra.slice(0, 5).map((k) => k.slice(0, 40)).join(", ")}`);
    return { ok: false, reason: "fields" };
  }

  const ip = await clientIp();
  if (!(await rateLimit(form, ip, RATE_LIMIT))) {
    console.warn(`${form} form: rate limit reached.`);
    return { ok: false, reason: "rate" };
  }

  const turnstile = await verifyTurnstile(form, formData, ip);
  if (turnstile === "rejected") return { ok: false, reason: "captcha" };
  if (turnstile === "unverified" && !(await rateLimit(`${form}-unverified`, ip, UNVERIFIED_RATE_LIMIT))) {
    console.warn(`${form} form: unverified rate limit reached.`);
    return { ok: false, reason: "rate-unverified" };
  }

  return { ok: true, verified: turnstile === "verified" };
}

/** What the person sees for each failure. Deliberately vague. */
export function guardMessage(reason: GuardFailure, email: string): string {
  switch (reason) {
    case "rate":
      return `You've sent this form several times in a short while. Please wait 10 minutes and try again, or email us at ${email}.`;
    case "rate-unverified":
      return `You've sent this form several times recently. Please try again in an hour, or email us at ${email}.`;
    case "captcha":
      return "Please refresh the page and try again.";
    default:
      return `Sorry, we couldn't send that. Please refresh the page and try again, or email us at ${email}.`;
  }
}
