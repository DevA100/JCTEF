import "server-only";

/**
 * Cloudflare Turnstile, checked on the server. It "fails open safely":
 * a genuine person can always submit, even when Turnstile itself fails,
 * but a bad token is still refused and unverified submissions get a much
 * stricter rate limit (src/lib/form-guard.ts) and are flagged to the team.
 *
 *   verified    a valid token, or Turnstile isn't set up (local development)
 *   unverified  no token (the widget couldn't load, or a script posting
 *               directly), or Cloudflare couldn't be reached
 *   rejected    a token Cloudflare says is invalid, expired or already used
 *
 * On only when both TURNSTILE_SITE_KEY (shown in the browser) and
 * TURNSTILE_SECRET_KEY (server only) are set.
 *
 * Logged on the server only: the form, the outcome and an error code.
 * Never the token, the secret or anything the person typed.
 */
export const TURNSTILE_FIELD = "cf-turnstile-response";
/** Sent by the form when the widget failed: "unavailable". */
export const TURNSTILE_STATUS_FIELD = "turnstileStatus";
/** The widget's error code, when it gave one (e.g. 110200). */
export const TURNSTILE_ERROR_FIELD = "turnstileError";

export type TurnstileStatus = "verified" | "unverified" | "rejected";

/** Cloudflare codes that mean the problem is on our side or theirs, not the person's token. */
const SERVICE_ERRORS = new Set(["missing-input-secret", "invalid-input-secret", "internal-error"]);

export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SITE_KEY?.trim() && process.env.TURNSTILE_SECRET_KEY?.trim());
}

/** Keeps a client-supplied error code safe to log: short, no odd characters. */
function cleanCode(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.replace(/[^\w.-]/g, "").slice(0, 20) || "none" : "none";
}

export async function verifyTurnstile(form: string, formData: FormData, ip: string): Promise<TurnstileStatus> {
  if (!turnstileEnabled()) return "verified";

  const tokenValue = formData.get(TURNSTILE_FIELD);
  const token = typeof tokenValue === "string" ? tokenValue.trim() : "";

  if (!token) {
    if (formData.get(TURNSTILE_STATUS_FIELD) === "unavailable") {
      console.warn(`Turnstile [${form}]: unverified, widget unavailable (code ${cleanCode(formData.get(TURNSTILE_ERROR_FIELD))}).`);
    } else {
      console.warn(`Turnstile [${form}]: unverified, no token and no widget error reported.`);
    }
    return "unverified";
  }
  if (token.length > 2048) {
    console.warn(`Turnstile [${form}]: rejected, token too long.`);
    return "rejected";
  }

  let result: { success?: boolean; "error-codes"?: string[] };
  try {
    const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!.trim(), response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error(`Turnstile [${form}]: unverified, Cloudflare returned HTTP ${response.status}.`);
      return "unverified";
    }
    result = (await response.json()) as typeof result;
  } catch (error) {
    console.error(`Turnstile [${form}]: unverified, Cloudflare unreachable (${error instanceof Error ? error.name : "error"}).`);
    return "unverified";
  }

  if (result.success === true) {
    console.info(`Turnstile [${form}]: verified.`);
    return "verified";
  }

  const codes = (result["error-codes"] ?? []).map((code) => String(code).slice(0, 40));
  if (codes.some((code) => SERVICE_ERRORS.has(code))) {
    console.error(`Turnstile [${form}]: unverified, Cloudflare service or configuration error (${codes.join(", ")}).`);
    return "unverified";
  }
  console.warn(`Turnstile [${form}]: rejected (${codes.join(", ") || "no reason given"}).`);
  return "rejected";
}
