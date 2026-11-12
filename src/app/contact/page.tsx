import { Clock, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { contact, site, seo } from "@/lib/content";

export const metadata: Metadata = pageMetadata({ ...seo.contact, path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow={contact.eyebrow} title={contact.title} text={contact.text} />

      <section aria-label="Contact details and form" className="section">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="grid content-start gap-8">
            <ul className="grid gap-4">
              <li className="flex gap-4">
                <MapPin aria-hidden="true" className="mt-1 size-6 shrink-0" />
                <div>
                  <h2 className="text-label uppercase text-ink-muted">Visit</h2>
                  <p>{site.address}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Mail aria-hidden="true" className="mt-1 size-6 shrink-0" />
                <div>
                  <h2 className="text-label uppercase text-ink-muted">Email</h2>
                  <a href={`mailto:${site.email}`} className="text-link inline-flex min-h-11 items-center">
                    {site.email}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <Clock aria-hidden="true" className="mt-1 size-6 shrink-0" />
                <div>
                  <h2 className="text-label uppercase text-ink-muted">Office hours</h2>
                  <p>{site.hours}</p>
                </div>
              </li>
            </ul>

            <div className="brutal brutal-static p-6">
              <h2 className="mb-4 text-h3">Write to the right team</h2>
              <dl className="grid gap-3">
                {site.enquiries.map((item) => (
                  <div key={item.label} className="grid gap-0.5 sm:grid-cols-[12rem_1fr] sm:items-center sm:gap-4">
                    <dt className="text-small font-bold text-ink-muted">{item.label}</dt>
                    <dd>
                      {"href" in item ? (
                        <Link href={item.href} className="text-link inline-flex min-h-11 items-center">
                          {item.linkLabel}
                        </Link>
                      ) : (
                        <a href={`mailto:${item.email}`} className="text-link inline-flex min-h-11 items-center">
                          {item.email}
                        </a>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="brutal brutal-static p-6 md:p-8">
            <h2 className="mb-6 text-h2">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
