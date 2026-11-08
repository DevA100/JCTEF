import { CruiseAvatar } from "@/components/cruise/avatar";
import { home, testimonials, type Testimonial } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";

function Person({ item }: { item: Testimonial }) {
  return (
    <div className="flex items-center gap-3">
      {/* Initials only until the fellows send photos. */}
      <CruiseAvatar name={item.name} tone="auto" size="lg" />
      <div className="grid">
        <span className="font-bold">{item.name}</span>
        <span className="text-small text-ink-muted">{item.role}</span>
      </div>
    </div>
  );
}

export function Testimonials() {
  if (testimonials.length === 0) return null;
  const { testimonials: copy } = home;

  return (
    <section aria-labelledby="testimonials-title" className="section">
      <div className="site-container grid gap-10">
        <SectionHeading id="testimonials-title" eyebrow={copy.eyebrow} title={copy.title} />
        <Reveal as="ul" stagger className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.name} className="brutal brutal-static grid content-between gap-6 p-6">
              {item.kind === "quote" ? (
                <figure className="grid gap-6">
                  <blockquote className="text-body">
                    <p>“{item.text}”</p>
                  </blockquote>
                  <figcaption>
                    <Person item={item} />
                  </figcaption>
                </figure>
              ) : (
                // Written about the fellow, not by them: no quotation marks.
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <h3 className="text-label uppercase text-ink-muted">What {item.pronoun ?? "they"} gained</h3>
                    <p className="text-body">{item.text}</p>
                  </div>
                  <Person item={item} />
                </div>
              )}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
