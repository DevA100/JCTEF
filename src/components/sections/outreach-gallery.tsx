"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { useRef, useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import type { OutreachPhoto } from "@/lib/content";

const CLD = { format: "auto", quality: "auto" } as const;

/**
 * The photo grid and its lightbox. Tiles are 4:3 face-aware crops, lazy
 * loaded and sized for the column width; the full-size photo is only
 * requested when the lightbox opens. The lightbox is a Base UI dialog styled
 * like CruiseModal (focus trap, Esc, focus back to the tile), wider so the
 * photo has room, with previous/next buttons, arrow keys and swipe.
 */
export function OutreachGallery({ photos }: { photos: OutreachPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const swipeStart = useRef<number | null>(null);
  /** The photo last shown, so focus returns to its tile on close. */
  const last = useRef(0);
  const count = photos.length;
  const current = open === null ? null : photos[open];

  const show = (index: number) => {
    last.current = index;
    setOpen(index);
  };
  const go = (step: number) => {
    if (open !== null) show((open + step + count) % count);
  };

  return (
    <>
      <Reveal as="ul" stagger className="grid grid-cols-1 gap-5 min-[360px]:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, i) => (
          <li key={photo.publicId}>
            <figure className="brutal flex h-full flex-col overflow-hidden">
              <button
                type="button"
                ref={(el) => {
                  tiles.current[i] = el;
                }}
                onClick={() => show(i)}
                className="relative block aspect-4/3 w-full cursor-zoom-in overflow-hidden bg-muted focus-visible:outline-offset-[-3px]"
              >
                <CldImage
                  src={photo.publicId}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 360px) 50vw, 100vw"
                  crop="fill"
                  gravity="faces"
                  aspectRatio="4:3"
                  loading="lazy"
                  {...CLD}
                  className="object-cover"
                />
                <span className="visually-hidden"> (open larger view)</span>
              </button>
              {photo.caption && (
                <figcaption className="flex-1 border-t-(length:--border-w) border-ink px-3 py-2.5 text-small">
                  {photo.caption}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </Reveal>

      <Dialog.Root open={open !== null} onOpenChange={(next) => !next && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-backdrop" />
          <Dialog.Popup
            // Back to the tile that was opened (or the one we navigated to).
            finalFocus={() => tiles.current[last.current] ?? true}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") go(1);
              if (event.key === "ArrowLeft") go(-1);
              // Keep Tab inside the lightbox: wrap from the last control to the
              // first (and back), rather than relying on focus guards alone.
              if (event.key === "Tab") {
                const controls = [...event.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled])")];
                const first = controls[0];
                const lastControl = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  lastControl?.focus();
                } else if (!event.shiftKey && document.activeElement === lastControl) {
                  event.preventDefault();
                  first?.focus();
                }
              }
            }}
            className="brutal brutal-static shadow-brutal-lg fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden text-ink"
          >
            <div className="on-primary flex items-center justify-between gap-4 border-b-(length:--border-w) border-ink py-2 pr-2 pl-4 md:pl-6">
              <Dialog.Title className="text-label uppercase">
                Photo {open === null ? "" : open + 1} of {count}
              </Dialog.Title>
              <Dialog.Close aria-label="Close" className="brutal flex size-11 shrink-0 items-center justify-center text-ink">
                <X className="size-6" aria-hidden="true" />
              </Dialog.Close>
            </div>

            {current && (
              <div
                className="relative min-h-0 flex-1 touch-pan-y bg-deep select-none"
                onPointerDown={(event) => {
                  swipeStart.current = event.clientX;
                  // Keep receiving the pointer even if it leaves the photo mid-swipe.
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerCancel={() => {
                  swipeStart.current = null;
                }}
                onPointerUp={(event) => {
                  if (swipeStart.current === null) return;
                  const dx = event.clientX - swipeStart.current;
                  swipeStart.current = null;
                  if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
                }}
              >
                {/* Full size, uncropped: only requested now the lightbox is open. */}
                <CldImage
                  key={current.publicId}
                  src={current.publicId}
                  alt={current.alt}
                  width={1600}
                  height={1200}
                  crop="limit"
                  sizes="(min-width: 960px) 896px, 100vw"
                  {...CLD}
                  draggable={false}
                  style={{ objectPosition: current.focus }}
                  className="mx-auto max-h-[calc(100dvh-12rem)] w-auto object-contain"
                />
              </div>
            )}

            <div className="flex items-center gap-3 border-t-(length:--border-w) border-ink p-3 md:p-4">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="brutal flex size-11 shrink-0 items-center justify-center text-ink"
              >
                <ChevronLeft className="size-6" aria-hidden="true" />
              </button>
              <Dialog.Description className="min-w-0 flex-1 text-center text-small">{current?.caption}</Dialog.Description>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="brutal flex size-11 shrink-0 items-center justify-center text-ink"
              >
                <ChevronRight className="size-6" aria-hidden="true" />
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
