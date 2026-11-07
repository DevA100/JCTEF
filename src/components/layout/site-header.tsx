import Image from "next/image";
import Link from "next/link";
import { cruiseButtonClasses } from "@/components/cruise/button";
import { DesktopNav, MobileNav } from "@/components/layout/main-nav";
import { navigation, site } from "@/lib/content";

/**
 * Sticky site header. The Donate button stays visible at every width;
 * below 1024px the five nav links move into the Cruise nav drawer.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b-(length:--border-w) border-ink bg-paper">
      <div className="site-container flex items-center gap-3 py-3 lg:gap-8">
        <Link href="/" className="mr-auto flex min-h-11 shrink-0 items-center" aria-label={`${site.shortName} home`}>
          {/* The logo PNG has a white background; multiply drops it onto the cream paper. */}
          <Image
            src="/images/jctef-logo.png"
            alt=""
            width={1200}
            height={393}
            sizes="160px"
            preload
            className="h-10 w-auto mix-blend-multiply sm:h-12"
          />
        </Link>
        <DesktopNav links={navigation.main} />
        <a
          href={navigation.donate.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cruiseButtonClasses({ className: "px-4 sm:px-6" })}
        >
          {navigation.donate.label}
          <span className="visually-hidden"> (opens Flutterwave in a new tab)</span>
        </a>
        <MobileNav links={[...navigation.main, ...navigation.secondary]} />
      </div>
    </header>
  );
}
