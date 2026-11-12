import type { Metadata, Viewport } from "next";
import { Baloo_2, Bricolage_Grotesque } from "next/font/google";
import { AnalyticsClicks } from "@/components/analytics/analytics-clicks";
import { ConsentBanner } from "@/components/analytics/consent-banner";
import { BackToTop } from "@/components/layout/back-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { events, seo, site } from "@/lib/content";
import { openGraphDefaults, siteUrl, twitterDefaults } from "@/lib/metadata";
import "./globals.css";

// Cruise UI type: Baloo 2 for display, Bricolage Grotesque for body text.
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Absolute URLs for every preview image and canonical link (previews break
  // with relative URLs). Set NEXT_PUBLIC_SITE_URL=https://jctef.org in production.
  metadataBase: siteUrl,
  title: {
    default: seo.home.title,
    template: `%s | ${site.shortName}`,
  },
  description: seo.home.description,
  // Defaults for pages without their own metadata. Pages use pageMetadata()
  // (src/lib/metadata.ts), which repeats these, since openGraph isn't merged.
  openGraph: { ...openGraphDefaults, url: "/", title: seo.home.title, description: seo.home.description },
  twitter: { ...twitterDefaults, title: seo.home.title, description: seo.home.description },
};

/** Organization structured data for search engines. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: site.shortName,
  alternateName: site.name,
  legalName: site.name,
  url: site.url,
  logo: `${site.url}/images/jctef-logo.png`,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lekki",
    addressRegion: "Lagos",
    addressCountry: "NG",
  },
  sameAs: site.socials.map((s) => s.href),
  identifier: {
    "@type": "PropertyValue",
    propertyID: "CAC registration number (Nigeria)",
    value: `${site.registration.label} ${site.registration.number}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1f5c", // brand navy (--deep)
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" data-scroll-behavior="smooth" className={`${baloo.variable} ${bricolage.variable}`}>
      <body className="cruise flex min-h-dvh flex-col antialiased" data-corners="soft">
        {/* Focus target for "Back to top". */}
        <div id="top" tabIndex={-1} className="outline-none" />
        <a href="#main" className="skip-link brutal on-primary px-4 py-3 font-bold">
          Skip to main content
        </a>
        {/* Early in the page so keyboard and screen reader users meet it first. */}
        <ConsentBanner />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <BackToTop />
        <AnalyticsClicks
          donateUrl={site.donateUrl}
          resetUrls={events.flatMap((event) => (event.slug.startsWith("reset") && event.cta ? [event.cta.href] : []))}
        />
        <script
          type="application/ld+json"
          // Escape "<" so the JSON can never close the script tag (Next.js JSON-LD guide).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
