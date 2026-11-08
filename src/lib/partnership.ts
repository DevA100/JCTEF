import "server-only";
import { site } from "./content";

/** Where partnership enquiries go (PARTNER_TO_EMAIL, e.g. partner@jctef.org);
 * also shown on the page as the "Prefer email?" address. */
export function partnershipEmail(): string {
  return process.env.PARTNER_TO_EMAIL?.trim() || site.email;
}
