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
  track,
}: {
  href: string;
  children: ReactNode;
  variant?: CruiseButtonVariant;
  className?: string;
  /** An analytics event counted on click (see src/components/analytics/analytics-clicks.tsx). */
  track?: "cohort_join_clicked";
}) {
  const classes = cruiseButtonClasses({ variant, className });
  const data = track ? { "data-track": track } : {};
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes} {...data}>
        {children}
      </Link>
    );
  }
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...data}>
        {children}
        <span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <a href={href} className={classes} {...data}>
      {children}
    </a>
  );
}
