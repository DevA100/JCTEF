"use client";

import { CruiseButton } from "@/components/cruise/button";
import { CruiseModal } from "@/components/cruise/modal";
import type { AlumnusTestimonial } from "@/lib/content";

/**
 * "Read their story": opens an alumnus's testimonial in a Cruise modal.
 * A quote is shown in quotation marks; a summary (written about them) as
 * "What she/he/they gained", never as a quote.
 */
export function FellowStory({ name, testimonial }: { name: string; testimonial: AlumnusTestimonial }) {
  return (
    <CruiseModal
      title={name}
      size="sm"
      trigger={
        <CruiseButton variant="secondary" className="w-full px-4 py-2 text-small">
          Read their story<span className="visually-hidden">: {name}</span>
        </CruiseButton>
      }
    >
      {testimonial.kind === "quote" ? (
        <figure className="grid gap-3">
          <blockquote>
            <p>“{testimonial.text}”</p>
          </blockquote>
          <figcaption className="text-small text-ink-muted">{name}, JCTEF Alumni</figcaption>
        </figure>
      ) : (
        <div className="grid gap-2">
          <h3 className="text-label uppercase text-ink-muted">What {testimonial.pronoun ?? "they"} gained</h3>
          <p>{testimonial.text}</p>
        </div>
      )}
    </CruiseModal>
  );
}
