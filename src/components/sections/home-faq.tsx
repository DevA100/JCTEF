import Link from "next/link";
import { CruiseAccordion } from "@/components/cruise/accordion";
import { ButtonLink } from "@/components/layout/button-link";
import { faqs } from "@/lib/content";
import { SectionHeading } from "./section-heading";

export function HomeFaq() {
  return (
    <section aria-labelledby="home-faq-title" className="section">
      <div className="site-container grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="grid content-start gap-6">
          <SectionHeading id="home-faq-title" eyebrow="FAQs" title="Questions people ask us" />
          <div>
            <ButtonLink href="/contact" variant="secondary">
              Ask us something else
            </ButtonLink>
          </div>
        </div>
        <CruiseAccordion
          items={faqs.map((item, i) => ({
            value: `home-faq-${i}`,
            title: item.question,
            content: (
              <div className="grid gap-3">
                <p>{item.answer}</p>
                {item.link && (
                  <p>
                    <TextLink href={item.link.href}>{item.link.label}</TextLink>
                  </p>
                )}
              </div>
            ),
          }))}
        />
      </div>
    </section>
  );
}

/** A text link: internal paths stay in the tab, external ones open a new tab. */
function TextLink({ href, children }: { href: string; children: string }) {
  if (!href.startsWith("http")) {
    return (
      <Link href={href} className="text-link inline-flex min-h-11 items-center">
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className="text-link inline-flex min-h-11 items-center"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
