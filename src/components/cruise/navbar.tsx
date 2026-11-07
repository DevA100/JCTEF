import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cruise-utils";
import { CRUISE_MENU_BREAKPOINTS, type CruiseMenuBreakpoint } from "./menu-breakpoints";
import { CruiseNavMenu } from "./nav-menu";

export type CruiseNavLink = { label: string; href: string; active?: boolean };

type NavbarProps = {
  logo: ReactNode;
  /** Inline from 768px; in the Menu drawer below that. */
  links?: CruiseNavLink[];
  /** The primary CTA plus any toggles: on the right from 768px, stacked at
   * the bottom of the Menu drawer below that. Use the "inverted" Button
   * variant when tone is "primary", and pass `drawerActions` too. */
  actions?: ReactNode;
  /** Actions for the drawer, if they differ from `actions`. The drawer is
   * --surface, so a yellow-navbar "inverted" CTA should become "primary". */
  drawerActions?: ReactNode;
  tone?: "paper" | "primary";
  /** Where the mobile drawer renders; defaults to <body>. */
  drawerContainer?: HTMLElement | null;
  /** Show the Menu drawer below this breakpoint (768px by default). Use "lg"
   * (1024px) when the actions are too wide to sit inline on a tablet. */
  menuBelow?: CruiseMenuBreakpoint;
  className?: string;
};

export function CruiseNavbar({
  logo,
  links = [],
  actions,
  drawerActions = actions,
  tone = "paper",
  drawerContainer,
  menuBelow = "md",
  className,
}: NavbarProps) {
  const bp = CRUISE_MENU_BREAKPOINTS[menuBelow];
  return (
    <header
      className={cx(
        "w-full border-b-(length:--border-w) border-ink",
        tone === "primary" ? "on-primary" : "bg-paper text-ink",
        className,
      )}
    >
      <nav className="site-container flex items-center gap-6 py-4">
        <Link href="/" className={cx("mr-auto min-w-0 truncate font-display text-h3 font-extrabold no-underline", bp.mr0)}>
          {logo}
        </Link>
        {links.length > 0 && (
          <ul className={cx("hidden items-center gap-6", bp.flex)}>
            {links.map((link) => (
              <li key={`${link.label}|${link.href}`}>
                <Link
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  className={cx(
                    "font-body font-medium no-underline decoration-ink decoration-3 underline-offset-6",
                    "hover:underline aria-[current=page]:underline",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {actions && <div className={cx("ml-auto hidden items-center gap-3", bp.flex)}>{actions}</div>}
        {(links.length > 0 || drawerActions) && (
          <CruiseNavMenu
            logo={logo}
            links={links}
            actions={drawerActions}
            portalContainer={drawerContainer}
            below={menuBelow}
          />
        )}
      </nav>
    </header>
  );
}
