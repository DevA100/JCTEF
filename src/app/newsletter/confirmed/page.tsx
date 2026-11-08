import type { Metadata } from "next";
import { ButtonLink } from "@/components/layout/button-link";

export const metadata: Metadata = {
  title: "Subscription confirmed",
  robots: { index: false },
};

/** Brevo sends people here after they click the double opt-in link. */
export default function NewsletterConfirmedPage() {
  return (
    <section className="section">
      <div className="site-container grid justify-items-start gap-6">
        <p className="eyebrow">Newsletter</p>
        <h1 className="text-h1">You&apos;re subscribed</h1>
        <p className="measure text-ink-muted">
          Thank you for confirming your email address. You will now hear about our fellows, events and new programmes a
          few times a year.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Back to the homepage</ButtonLink>
          <ButtonLink href="/blog" variant="secondary">
            Read our latest stories
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
