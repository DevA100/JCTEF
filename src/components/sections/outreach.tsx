import { outreach, outreachPhotos } from "@/lib/content";
import { OutreachGallery } from "./outreach-gallery";
import { SectionHeading } from "./section-heading";

/** "Outreach in action" photo gallery. Hidden until photos are added. */
export function Outreach() {
  if (outreachPhotos.length === 0 || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) return null;
  return (
    <section aria-labelledby="outreach-title" className="section">
      <div className="site-container grid gap-10">
        <SectionHeading id="outreach-title" eyebrow={outreach.eyebrow} title={outreach.title}>
          <p>{outreach.text}</p>
        </SectionHeading>
        <OutreachGallery photos={outreachPhotos} />
      </div>
    </section>
  );
}
