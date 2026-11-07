import { ArrowRight, Quote } from "lucide-react";
import Image from "next/image";
import { founder } from "@/lib/content";
import { SectionHeading } from "./section-heading";

export function Founder() {
  return (
    <section id="founder" aria-labelledby="founder-title" className="section scroll-mt-20">
      <div className="site-container grid gap-14">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <figure className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="brutal brutal-static overflow-hidden">
              <Image
                src={founder.photo.src}
                alt={founder.photo.alt}
                width={founder.photo.width}
                height={founder.photo.height}
                sizes="(min-width: 1024px) 420px, 384px"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="on-primary brutal brutal-static absolute -bottom-5 left-4 px-4 py-2 font-display font-extrabold">
              {founder.name}
            </figcaption>
          </figure>

          <div className="grid gap-6">
            <SectionHeading id="founder-title" eyebrow="Meet the founder" title={founder.name}>
              <p className="font-bold text-ink">{founder.role}</p>
            </SectionHeading>
            <blockquote className="flex gap-4 border-l-4 border-primary pl-5">
              <Quote aria-hidden="true" className="size-8 shrink-0 text-success" />
              <p className="font-display text-h3 font-extrabold">{founder.quote}</p>
            </blockquote>
            {/* The philosophy, as a mini route. */}
            <div>
              <h3 className="mb-3 text-label uppercase text-ink-muted">The philosophy</h3>
              <ol className="flex flex-wrap items-center gap-2">
                {founder.philosophy.map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="rounded-brutal border-2 border-ink bg-surface px-3 py-1.5 font-display font-extrabold">
                      {step}
                    </span>
                    {i < founder.philosophy.length - 1 && <ArrowRight aria-hidden="true" className="size-5" />}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {founder.story.map((chapter) => (
            <article key={chapter.title} className="grid content-start gap-3">
              <h3 className="text-h3">{chapter.title}</h3>
              {chapter.text.map((p) => (
                <p key={p} className="text-ink-muted">
                  {p}
                </p>
              ))}
            </article>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="brutal brutal-static p-6 md:p-8">
            <h3 className="mb-4 text-h3">What I believe</h3>
            <ul className="grid gap-3">
              {founder.beliefs.map((belief) => (
                <li key={belief} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 bg-primary" />
                  {belief}
                </li>
              ))}
            </ul>
          </div>
          <div className="on-deep brutal brutal-static grid content-start gap-4 p-6 md:p-8">
            <h3 className="text-h3">A message to every dreamer</h3>
            {founder.message.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="font-display font-extrabold">— {founder.name}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
