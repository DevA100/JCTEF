import "server-only";

/**
 * Cloudflare Turnstile, checked on the server.
 *
 * On only when both TURNSTILE_SITE_KEY (shown in the browser) and
 * TURNSTILE_SECRET_KEY (server only) are set, so local development works
 * without them. When on, a submission without a valid token is rejected.
 * If Cloudflare can't be reached, the submission is rejected too (fail
 * closed); the person can try again or email us.
 */
export const TURNSTILE_FIELD = "cf-turnstile-response";

export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SITE_KEY?.trim() && process.env.TURNSTILE_SECRET_KEY?.trim());
}

export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  if (!turnstileEnabled()) return true;
  if (!token || token.length > 2048) return false;

  try {
    const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!.trim(), response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });
    const result = (await response.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!result.success) console.warn("Turnstile: token rejected:", (result["error-codes"] ?? []).join(", ") || "no reason given");
    return result.success === true;
  } catch (error) {
    console.error("Turnstile: verification failed:", error instanceof Error ? error.message : error);
    return false;
  }
}
