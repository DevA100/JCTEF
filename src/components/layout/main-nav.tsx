"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cruiseButtonClasses } from "@/components/cruise/button";
import { CruiseNavMenu } from "@/components/cruise/nav-menu";
import type { CruiseNavLink } from "@/components/cruise/navbar";
import { cx } from "@/lib/cruise-utils";
import { navigation, type Link as NavLink } from "@/lib/content";

function useActiveLinks(links: NavLink[]): CruiseNavLink[] {
  const pathname = usePathname();
  return links.map((link) => ({
    ...link,
    active: pathname === link.href || pathname.startsWith(`${link.href}/`),
  }));
}

/** Inline links from 1024px (same styling as CruiseNavbar's desktop list). */
export function DesktopNav({ links }: { links: NavLink[] }) {
  const items = useActiveLinks(links);
  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-6">
        {items.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={link.active ? "page" : undefined}
              className={cx(
                "nav-link inline-flex min-h-11 items-center font-body font-medium no-underline",
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The Cruise nav drawer, below 1024px. */
export function MobileNav({ links }: { links: NavLink[] }) {
  const items = useActiveLinks(links);
  return (
    <CruiseNavMenu
      logo="JCTEF"
      links={items}
      below="lg"
      actions={
        <a
          href={navigation.donate.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cruiseButtonClasses()}
          data-analytics-location="menu"
        >
          Donate to JCTEF
          <span className="visually-hidden"> (opens Flutterwave in a new tab)</span>
        </a>
      }
    />
  );
}
