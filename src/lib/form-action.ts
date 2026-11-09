import { unstable_isUnrecognizedActionError } from "next/navigation";

/**
 * Wraps a form's Server Action for useActionState so a failed submission
 * always ends as an error toast, never the site's error page.
 *
 * The actions themselves never throw (see src/lib/action-errors.ts), but a
 * call can still fail before our code runs:
 * - the page is from an older deploy, so the server no longer knows the
 *   action (Next.js throws UnrecognizedActionError);
 * - the network drops, or Netlify returns an error (e.g. a function timeout).
 * Without this, useActionState rethrows and React shows error.tsx.
 */
export const STALE_PAGE_MESSAGE = "The site was just updated. Please refresh the page and try again.";

export function networkErrorMessage(email: string): string {
  return `Sorry, we couldn't reach our server, so this wasn't sent. Please check your connection and try again, or email us at ${email}.`;
}

export function withFailSafe<S>(
  action: (prev: S, formData: FormData) => Promise<S>,
  onError: (prev: S, formData: FormData, message: string) => S,
  email: string,
): (prev: S, formData: FormData) => Promise<S> {
  return async (prev, formData) => {
    try {
      return await action(prev, formData);
    } catch (error) {
      const stale = unstable_isUnrecognizedActionError(error);
      console.error(stale ? "Form: this page is out of date (site was redeployed)." : "Form: submission failed.", error);
      return onError(prev, formData, stale ? STALE_PAGE_MESSAGE : networkErrorMessage(email));
    }
  };
}
