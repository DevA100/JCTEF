import { Handshake, Heart, Users } from "lucide-react";
import { ButtonLink } from "@/components/layout/button-link";
import { TrustLine } from "@/components/layout/trust-line";
import { cx } from "@/lib/cruise-utils";
import { home } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/motion/reveal";

const ICONS = [Users, Handshake, Heart];

export function GetInvolvedCards() {
  const { getInvolved } = home;
  return (
    <section aria-labelledby="involved-title" className="on-deep section">
      <div className="site-container grid gap-10">
        <SectionHeading id="involved-title" eyebrow={getInvolved.eyebrow} title={getInvolved.title} />
        <Reveal as="ul" stagger className="grid gap-6 md:grid-cols-3">
          {getInvolved.cards.map((card, i) => {
            const Icon = ICONS[i];
            const isDonate = i === getInvolved.cards.length - 1;
            return (
              <li
                key={card.title}
                className={cx("brutal brutal-static grid content-start gap-4 p-6 md:p-8", isDonate && "on-primary")}
              >
                <Icon aria-hidden="true" className="size-9" />
                <h3 className="text-h2">{card.title}</h3>
                <p className={isDonate ? undefined : "text-ink-muted"}>{card.text}</p>
                <div className="pt-2">
                  <ButtonLink href={card.cta.href} variant={isDonate ? "inverted" : "primary"}>
                    {card.cta.label}
                  </ButtonLink>
                </div>
                {isDonate && <TrustLine />}
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
