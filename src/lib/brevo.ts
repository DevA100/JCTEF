/**
 * Minimal Brevo (ex-Sendinblue) REST client, used only by Server Actions.
 * Docs: https://developers.brevo.com/reference
 * The API key is read from the environment and never reaches the browser.
 */

const BASE = "https://api.brevo.com/v3";

export class BrevoError extends Error {
  constructor(
    public status: number,
    public code: string | undefined,
    message: string,
  ) {
    super(message);
  }
}

export function brevoConfigured(...names: string[]): boolean {
  return ["BREVO_API_KEY", ...names].every((name) => Boolean(process.env[name]));
}

export async function brevo<T = unknown>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: init.method ?? "GET",
    headers: {
      "api-key": process.env.BREVO_API_KEY ?? "",
      accept: "application/json",
      ...(init.body ? { "content-type": "application/json" } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
    throw new BrevoError(res.status, data.code, data.message ?? res.statusText);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** Escapes text for the HTML body of a notification email. */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}
