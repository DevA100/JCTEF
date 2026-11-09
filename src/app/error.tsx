"use client";

import { CruiseButton } from "@/components/cruise/button";
import { ButtonLink } from "@/components/layout/button-link";
import { site } from "@/lib/content";

/**
 * Shown when part of a page fails. Never shows technical details: the
 * reference code matches the server log entry, nothing more.
 */
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const reference = error instanceof Error ? error.digest : undefined;
  return (
    <section className="section">
      <div className="site-container grid justify-items-start gap-6">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="text-h1">We hit a pothole</h1>
        <p className="measure text-ink-muted">
          This page didn&apos;t load properly. Please try again. If it keeps happening, email us at{" "}
          <a href={`mailto:${site.email}`} className="text-link">
            {site.email}
          </a>
          {reference ? " and quote the reference below." : "."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <CruiseButton type="button" onClick={() => retry()}>
            Try again
          </CruiseButton>
          <ButtonLink href="/" variant="secondary">
            Go to the homepage
          </ButtonLink>
        </div>
        {reference && <p className="text-small text-ink-muted">Reference: {reference}</p>}
      </div>
    </section>
  );
}
