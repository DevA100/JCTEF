import "server-only";

/**
 * Adds a form submission as a row in the JCTEF Google Sheet, through the
 * Apps Script web app in integrations/google-sheets/Code.gs.
 *
 * `data` is keyed by column heading ("First name", "Email", …). The script
 * matches columns by heading and adds any new heading as a new column.
 *
 * This never throws: a failed write is logged on the server and the form
 * carries on. Call it inside after() so it runs once the response is sent.
 */
export type SheetForm = "volunteer" | "partner" | "contact";
export type SheetRow = Record<string, string | string[] | undefined | null>;

const TIMEOUT_MS = 10_000;
let warnedMissing = false;

/** Stops a value being run as a formula when the sheet opens it. */
export function neutraliseFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

/** "08/11/2026 22:35", Lagos time. */
export function sheetTimestamp(date = new Date()): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
}

function toCells(data: SheetRow): Record<string, string> {
  const cells: Record<string, string> = {};
  for (const [heading, value] of Object.entries(data)) {
    const text = Array.isArray(value) ? value.join(", ") : (value ?? "");
    cells[heading] = neutraliseFormula(String(text));
  }
  return cells;
}

export async function appendToSheet(form: SheetForm, data: SheetRow): Promise<void> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim();
  if (!url || !secret) {
    if (!warnedMissing) {
      warnedMissing = true;
      console.warn("Google Sheets: GOOGLE_SHEETS_WEBHOOK_URL or _SECRET is not set; submissions are not being copied to the sheet.");
    }
    return;
  }

  try {
    // Apps Script answers with a redirect to the result; fetch follows it.
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, form, data: { "Submitted at": sheetTimestamp(), ...toCells(data) } }),
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const text = await response.text();
    let result: { ok?: boolean; error?: string } = {};
    try {
      result = JSON.parse(text);
    } catch {
      // Not JSON: usually a Google sign-in page (wrong "Who has access" setting).
    }
    if (!response.ok || result.ok !== true) {
      console.error(
        `Google Sheets: could not add the ${form} row (HTTP ${response.status}): ${result.error ?? "unexpected response; check the deployment's access is set to Anyone"}`,
      );
    }
  } catch (error) {
    const reason = error instanceof Error && error.name === "TimeoutError" ? "timed out after 10 seconds" : error;
    console.error(`Google Sheets: could not add the ${form} row:`, reason);
  }
}
