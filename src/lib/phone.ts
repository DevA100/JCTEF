import { parsePhoneNumberFromString } from "libphonenumber-js/min";
import { z } from "zod";

/**
 * Phone numbers from any country. Used in the browser (the forms' own
 * checks) and on the server (the Server Actions), so both give the same
 * answer. Uses the same libphonenumber-js metadata ("min": valid lengths
 * and leading digits per country) as the Cruise phone input.
 *
 * Stored and sent everywhere as E.164: "+447700900123".
 */

export const PHONE_ERROR = "Please enter a valid phone number, including the right country.";

/** Top of the country picker: Nigeria, then our diaspora and partner audience. */
export const PREFERRED_COUNTRIES = ["NG", "GH", "KE", "ZA", "GB", "US", "CA"];

/** The E.164 form of a full international number, or null if it isn't valid. */
export function toE164(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith("+") || trimmed.length > 40) return null;
  const parsed = parsePhoneNumberFromString(trimmed);
  return parsed?.isValid() ? parsed.number : null;
}

/** "+447700900123" -> "+44 7700 900123", for people to read (team emails). */
export function formatPhone(e164: string): string {
  return parsePhoneNumberFromString(e164)?.formatInternational() ?? e164;
}

/**
 * An optional phone field. The form sends the E.164 number, or what was
 * typed when it isn't a valid number (so it's refused here, not dropped).
 * Empty means not given.
 */
export const optionalPhone = z
  .string()
  .trim()
  .optional()
  .transform((value, ctx) => {
    if (!value) return undefined;
    const e164 = toE164(value);
    if (!e164) {
      ctx.addIssue({ code: "custom", message: PHONE_ERROR });
      return z.NEVER;
    }
    return e164;
  });
