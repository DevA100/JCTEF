"use client";

import { Dialog } from "@base-ui/react/dialog";
import { TriangleAlert, X } from "lucide-react";
import type { FormEvent, ReactElement, ReactNode, RefObject } from "react";
import { cx } from "@/lib/cruise-utils";
import { CruiseButton, CruiseButtonGroup } from "./button";

type ModalProps = {
  title: ReactNode;
  /** One line under the title, linked with aria-describedby. */
  description?: ReactNode;
  children?: ReactNode;
  /** Element that opens the modal, e.g. <Button>. Omit when controlled. */
  trigger?: ReactElement;
  /** Buttons along the bottom (your own). Or use primaryAction / cancelLabel. */
  footer?: ReactNode;
  /** The main button; in a danger modal it's a danger button. With onSubmit,
   * it submits the form. */
  primaryAction?: { label: ReactNode; onClick?: () => void; disabled?: boolean };
  /** Adds a Cancel button that closes the modal (with primaryAction). */
  cancelLabel?: ReactNode;
  /** Width: sm 24rem, md 32rem (default), lg 48rem. */
  size?: "sm" | "md" | "lg";
  /** "danger": a --danger title bar with a warning icon, for deletes and
   * other actions that can't be undone. */
  tone?: "default" | "danger";
  /** Wraps the body and footer in one <form>, so a submit button in the
   * footer submits the fields in the body (no form="id" needed). */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  /** With onSubmit: true lets the browser validate the form and show its own
   * popups. Default false: noValidate, and Cruise fields show errors inline. */
  nativeValidation?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element to focus when the modal opens; defaults to the first focusable. */
  initialFocus?: RefObject<HTMLElement | null>;
};

/** Form mode: with noValidate the browser shows no popups; the form's
 * constraints (required, pattern, min…) are still checked here, which fires
 * each field's "invalid" event so Cruise fields show their message inline.
 * onSubmit runs only when every field passes; otherwise the first invalid
 * field gets focus. */
function submitWhenValid(onSubmit: (event: FormEvent<HTMLFormElement>) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.preventDefault();
      const first = Array.from(form.elements).find(
        (el) => !(el instanceof HTMLFieldSetElement) && "validity" in el && !(el as HTMLInputElement).validity.valid,
      );
      (first as HTMLElement | undefined)?.focus();
      return;
    }
    onSubmit(event);
  };
}

const WIDTHS = { sm: "max-w-[24rem]", md: "max-w-[32rem]", lg: "max-w-[48rem]" } as const;

export function CruiseModal({
  title,
  description,
  children,
  trigger,
  footer,
  primaryAction,
  cancelLabel,
  size = "md",
  tone = "default",
  onSubmit,
  nativeValidation = false,
  open,
  onOpenChange,
  initialFocus,
}: ModalProps) {
  const danger = tone === "danger";
  const actions =
    footer ??
    (primaryAction || cancelLabel ? (
      <>
        {cancelLabel && <Dialog.Close render={<CruiseButton variant="secondary">{cancelLabel}</CruiseButton>} />}
        {primaryAction && (
          <CruiseButton
            variant={danger ? "danger" : "primary"}
            type={onSubmit ? "submit" : "button"}
            disabled={primaryAction.disabled}
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </CruiseButton>
        )}
      </>
    ) : null);

  const body = (
    <>
      <div className="overflow-y-auto p-6 text-body">
        {description && <Dialog.Description className="mb-4 text-ink-muted">{description}</Dialog.Description>}
        {children}
      </div>
      {actions && (
        <CruiseButtonGroup align="end" className="px-6 pb-6">
          {actions}
        </CruiseButtonGroup>
      )}
    </>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger render={trigger} />}
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-backdrop" />
        <Dialog.Popup
          initialFocus={initialFocus}
          className={cx(
            "brutal brutal-static shadow-brutal-lg fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden text-ink",
            WIDTHS[size],
          )}
        >
          <div
            className={cx(
              "flex items-center justify-between gap-4 border-b-(length:--border-w) border-ink py-2 pr-2 pl-6",
              danger ? "bg-danger text-on-danger" : "on-primary",
            )}
          >
            <Dialog.Title className="flex items-center gap-2 text-h3">
              {danger && <TriangleAlert aria-hidden="true" strokeWidth={2.5} className="size-6 shrink-0" />}
              {title}
            </Dialog.Title>
            <Dialog.Close aria-label="Close" className="brutal flex size-11 shrink-0 items-center justify-center text-ink">
              <X className="size-6" aria-hidden="true" />
            </Dialog.Close>
          </div>
          {onSubmit ? (
            // display: contents keeps the layout (scrolling body, footer below).
            <form
              onSubmit={nativeValidation ? onSubmit : submitWhenValid(onSubmit)}
              noValidate={!nativeValidation}
              className="contents"
            >
              {body}
            </form>
          ) : (
            body
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
