"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { CruiseButtonGroup } from "./button";
import { cx } from "@/lib/cruise-utils";
import { CRUISE_MENU_BREAKPOINTS, type CruiseMenuBreakpoint } from "./menu-breakpoints";
import type { CruiseNavLink } from "./navbar";

/**
 * Mobile navigation (below 768px, or 1024px with `below="lg"`): a square
 * .brutal "Menu" button that opens a drawer sliding in from the left. base-ui's Dialog provides Esc to close,
 * backdrop tap to close, focus moving in on open and back to the Menu button
 * on close, and page scroll lock.
 */
export function CruiseNavMenu({
  logo,
  links,
  actions,
  portalContainer,
  below = "md",
}: {
  logo: ReactNode;
  links: CruiseNavLink[];
  /** Shown stacked at the bottom of the drawer (toggle + primary CTA). */
  actions?: ReactNode;
  /** Where the drawer renders; defaults to <body>. Pass an element with
   * `contain: layout` to keep the drawer inside it (e.g. a preview frame). */
  portalContainer?: HTMLElement | null;
  /** The breakpoint where the inline navbar takes over. */
  below?: CruiseMenuBreakpoint;
}) {
  const [open, setOpen] = useState(false);
  const bp = CRUISE_MENU_BREAKPOINTS[below];

  // Close if the viewport grows past the mobile breakpoint while open,
  // so the scroll lock isn't left behind a hidden drawer.
  useEffect(() => {
    const desktop = window.matchMedia(bp.query);
    function onChange(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [bp.query]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        data-nav-control=""
        aria-label="Menu"
        className={cx("brutal flex size-11 shrink-0 touch-manipulation items-center justify-center text-ink", bp.hidden)}
      >
        <Menu className="size-6" aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal container={portalContainer ?? undefined}>
        <Dialog.Backdrop className={cx("fixed inset-0 z-40 bg-backdrop", bp.hidden)} />
        <Dialog.Popup
          className={cx(
            "nav-drawer fixed inset-y-0 left-0 z-50 flex w-[min(85vw,320px)] flex-col",
            bp.hidden,
            "border-r-(length:--border-w) border-ink bg-surface text-ink shadow-brutal-lg",
            // Rounded on its inner edge only; the outer edge meets the screen.
            "overflow-hidden rounded-r-brutal",
          )}
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <div className="on-primary flex items-center justify-between gap-4 border-b-(length:--border-w) border-ink py-2 pr-2 pl-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="min-w-0 truncate font-display text-h3 font-extrabold no-underline"
            >
              {logo}
            </Link>
            <Dialog.Close
              data-nav-control=""
              aria-label="Close menu"
              className="brutal flex size-11 shrink-0 touch-manipulation items-center justify-center text-ink"
            >
              <X className="size-6" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <nav aria-label="Main" className="flex-1 overflow-y-auto">
            <ul className="flex flex-col divide-y-2 divide-ink border-b-2 border-ink">
              {links.map((link) => (
                <li key={`${link.label}|${link.href}`}>
                  <Link
                    href={link.href}
                    aria-current={link.active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cx(
                      "flex min-h-11 items-center px-4 py-3 font-body text-body font-medium no-underline",
                      "decoration-ink decoration-3 underline-offset-6 hover:underline aria-[current=page]:underline",
                      "focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-info",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {actions && (
            <div className="border-t-(length:--border-w) border-ink p-4">
              <CruiseButtonGroup>{actions}</CruiseButtonGroup>
            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
