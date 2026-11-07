"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactElement, ReactNode, RefObject } from "react";
import { cx } from "@/lib/cruise-utils";

/**
 * Drawer (sheet), spec A5: a side panel. `left` for navigation, `right` for
 * a cart, filters or details; with `sheet`, a right drawer becomes a bottom
 * sheet below 640px. Base UI Dialog gives role="dialog", aria-modal,
 * aria-labelledby (the title), focus trap, Esc, backdrop close and scroll
 * lock; the look and the slide come from `.drawer` in theme.css.
 */
export function CruiseDrawer({
  title,
  trigger,
  children,
  footer,
  side = "right",
  sheet = false,
  open,
  onOpenChange,
  className,
  initialFocus,
}: {
  title: ReactNode;
  /** The button that opens it (gets aria-expanded / aria-controls). */
  trigger?: ReactElement;
  children: ReactNode;
  /** Sticky actions at the bottom. */
  footer?: ReactNode;
  side?: "left" | "right";
  sheet?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Extra classes on the panel, e.g. "nepa-mode" to force dark mode. */
  className?: string;
  /** What gets focus on open (defaults to the first focusable element). */
  initialFocus?: RefObject<HTMLElement | null>;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger render={trigger} />}
      <Dialog.Portal>
        <Dialog.Backdrop className="drawer-backdrop" />
        <Dialog.Popup
          className={cx("drawer is-open", className)}
          data-side={side}
          data-sheet={sheet ? "" : undefined}
          initialFocus={initialFocus}
          // Base UI makes the rest of the page inert; the spec also wants
          // aria-modal so every screen reader treats it as modal.
          aria-modal="true"
        >
          <div className="drawer-head">
            <Dialog.Title render={<h2 />}>{title}</Dialog.Title>
            <Dialog.Close className="brutal drawer-close" aria-label="Close">
              <X className="size-6" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="drawer-body">{children}</div>
          {footer && <div className="drawer-foot">{footer}</div>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
