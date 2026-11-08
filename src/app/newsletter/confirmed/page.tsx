import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/layout/button-link";

export const metadata: Metadata = {
  title: "Subscription confirmed",
  robots: { index: false },
};

/** Brevo sends people here after they click the link in the confirmation email. */
export default function NewsletterConfirmedPage() {
  return (
    <section className="section">
      <div className="site-container">
        <div className="brutal brutal-static mx-auto grid max-w-2xl justify-items-start gap-6 p-6 md:p-10">
          <span className="on-primary grid size-14 place-items-center rounded-brutal border-(length:--border-w) border-ink">
            <CheckCircle2 aria-hidden="true" className="size-8" />
          </span>
          <p className="eyebrow">Newsletter</p>
          <h1 className="text-h1">You&apos;re subscribed!</h1>
          <p className="measure text-body text-ink-muted">
            Thank you for confirming your email address. We&apos;ll keep you posted on our programmes, events and fellows&apos;
            stories.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/programmes">Explore our programmes</ButtonLink>
            <ButtonLink href="/" variant="secondary">
              Back to home
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
