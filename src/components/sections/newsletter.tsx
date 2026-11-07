import { Mail } from "lucide-react";
import { home } from "@/lib/content";
import { NewsletterForm } from "./newsletter-form";

export function Newsletter() {
  const { newsletter } = home;
  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className="section scroll-mt-20">
      <div className="site-container">
        <div className="brutal brutal-static grid gap-8 p-6 md:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
          <div className="grid content-start gap-4">
            <span className="grid size-12 place-items-center rounded-brutal border-2 border-ink bg-sun">
              <Mail aria-hidden="true" className="size-6" />
            </span>
            <h2 id="newsletter-title" className="text-h2">
              {newsletter.title}
            </h2>
            <p className="text-ink-muted">{newsletter.text}</p>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
