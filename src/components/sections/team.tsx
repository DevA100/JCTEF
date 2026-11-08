import { MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { team } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { TeamPhoto } from "./team-photo";

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

/** "Meet our team" on /about, after the founder. */
export function Team() {
  return (
    <section id="team" aria-labelledby="team-title" className="section scroll-mt-20">
      <div className="site-container grid gap-10">
        <SectionHeading id="team-title" eyebrow="Our team" title="The people behind JCTEF">
          <p>A dedicated team committed to helping young people move from potential to productivity.</p>
        </SectionHeading>

        <Reveal as="ul" stagger className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {team.map((member) => (
            <li key={member.name} className="brutal brutal-static flex flex-col overflow-hidden bg-surface">
              <TeamPhoto src={member.image} name={member.name} alt={`${member.name}, ${member.role} at JCTEF`} />
              <div className="flex flex-1 items-start justify-between gap-3 border-t-2 border-ink p-4 md:p-5">
                <div className="grid min-w-0 gap-1">
                  <h3 className="font-display text-[1.0625rem] leading-tight font-extrabold md:text-[1.25rem]">{member.name}</h3>
                  <p className="text-small font-bold text-success">{member.role}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-small text-ink-muted">
                    <MapPin aria-hidden="true" className="size-4 shrink-0" />
                    {member.location}
                  </p>
                </div>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="brutal grid size-11 shrink-0 place-items-center bg-surface"
                  >
                    <LinkedInIcon />
                  </a>
                )}
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
