import "server-only";

/**
 * Last line of defence for the form Server Actions: anything a form action
 * throws (a bug, Netlify Blobs, Turnstile, Brevo, a timeout) is logged here
 * and turned into an ordinary error result, so the person sees an error
 * toast instead of the site's error page.
 */
export function logActionFailure(form: string, error: unknown): void {
  console.error(`${form} form: unexpected error:`, error instanceof Error ? `${error.name}: ${error.message}` : error);
}

export function unexpectedErrorMessage(email: string): string {
  return `Sorry, something went wrong and this wasn't sent. Please try again, or email us at ${email}.`;
}
