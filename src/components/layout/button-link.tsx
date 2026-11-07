import Link from "next/link";
import type { ReactNode } from "react";
import { cruiseButtonClasses, type CruiseButtonVariant } from "@/components/cruise/button";

const isExternal = (href: string) => /^https?:\/\//.test(href);

/**
 * A Cruise button that is a link: next/link for internal routes; a new tab
 * (announced to screen readers) for external ones; a plain <a> for mailto:/tel:.
 */
export function ButtonLink({
  href,
  children,
  variant,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: CruiseButtonVariant;
  className?: string;
}) {
  const classes = cruiseButtonClasses({ variant, className });
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        <span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
