import { ButtonLink } from "@/components/layout/button-link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="site-container grid justify-items-start gap-6">
        <p className="eyebrow">Error 404</p>
        <h1 className="text-h1">Wrong bus stop</h1>
        <p className="measure text-ink-muted">
          We could not find that page. It may have moved when we rebuilt our website. Let us get you back on route.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Go to the homepage</ButtonLink>
          <ButtonLink href="/programmes" variant="secondary">
            See our programmes
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
