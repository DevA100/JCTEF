import { cacheLife } from "next/cache";
import Link from "next/link";
import { CruiseWhatsAppButton } from "@/components/cruise/whatsapp-button";
import { navigation, site } from "@/lib/content";

/** Cached for a day, so the year rolls over without a request-time render. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  const socials = site.socials.filter((s) => s.href !== null);

  return (
    <footer className="on-deep">
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
            <a href={site.phoneHref} className="text-link inline-flex min-h-11 items-center">
              {site.phone}
            </a>
          </address>
          <div>
            <CruiseWhatsAppButton phone={site.whatsapp} message={site.whatsappMessage} />
          </div>
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
          <ul className="grid gap-0.5">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center hover:underline"
                >
                  {social.label}
                  <span className="visually-hidden"> (opens in a new tab)</span>
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
        <p className="site-container py-5 text-small text-ink-muted">
          © <CopyrightYear /> {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
