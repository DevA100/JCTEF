import { cacheLife } from "next/cache";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics/cookie-settings-button";
import { navigation, registration, site } from "@/lib/content";

/** Cached for a day, so the year rolls over without a request-time render. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  return (
    <footer data-analytics-location="footer" className="on-deep">
      <div className="danfo-stripe on-primary" aria-hidden="true" />
      <div className="site-container grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="grid content-start gap-5">
          <p className="font-display text-h2 font-extrabold">{site.shortName}</p>
          <p className="measure text-ink-muted">
            {site.name}. {site.tagline}.
          </p>
          <address className="grid gap-1 not-italic">
            <span>{site.address}</span>
            <a href={`mailto:${site.email}`} className="text-link inline-flex min-h-11 items-center">
              {site.email}
            </a>
          </address>
        </div>

        <nav aria-labelledby="footer-links">
          <h2 id="footer-links" className="mb-4 text-label uppercase text-ink-muted">
            Quick links
          </h2>
          <ul className="grid gap-0.5">
            {navigation.footer.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-11 items-center hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-label uppercase text-ink-muted">Follow us</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`JCTEF on ${social.label} (opens in a new tab)`}
                  className="inline-flex min-h-11 items-center hover:underline"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={site.donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link mt-6 inline-flex min-h-11 items-center text-primary"
          >
            Donate to JCTEF
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
      <div className="border-t-(length:--border-w) border-ink/20">
        <div className="site-container flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3 pr-20 text-small text-ink-muted">
          <p className="py-2">
            © <CopyrightYear /> {site.name}. All rights reserved. · {registration.short}
          </p>
          <div className="flex flex-wrap gap-x-5">
            <Link href="/privacy" className="inline-flex min-h-11 items-center hover:underline">
              Privacy
            </Link>
            <CookieSettingsButton className="inline-flex min-h-11 cursor-pointer items-center hover:underline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
