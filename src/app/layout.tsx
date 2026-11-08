import type { Metadata, Viewport } from "next";
import { Baloo_2, Bricolage_Grotesque } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { site } from "@/lib/content";
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
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName}: ${site.coreMessage.charAt(0).toUpperCase()}${site.coreMessage.slice(1)}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: site.name,
    url: site.url,
    description: site.description,
  },
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
  telephone: site.phoneHref.replace("tel:", ""),
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
  themeColor: "#2ead45",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${baloo.variable} ${bricolage.variable}`}>
      <body className="cruise flex min-h-dvh flex-col antialiased" data-corners="soft">
        <a href="#main" className="skip-link brutal on-primary px-4 py-3 font-bold">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <script
          type="application/ld+json"
          // Escape "<" so the JSON can never close the script tag (Next.js JSON-LD guide).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
