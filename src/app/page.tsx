import { AboutIntro } from "@/components/sections/about-intro";
import { Audiences } from "@/components/sections/audiences";
import { Events } from "@/components/sections/events";
import { HomeFaq } from "@/components/sections/home-faq";
import { GetInvolvedCards } from "@/components/sections/get-involved-cards";
import { Hero } from "@/components/sections/hero";
import { Impact } from "@/components/sections/impact";
import { Newsletter } from "@/components/sections/newsletter";
import { Testimonials } from "@/components/sections/testimonials";
import { Outreach } from "@/components/sections/outreach";
import { Partners } from "@/components/sections/partners";
import { VisionValues } from "@/components/sections/vision-values";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutIntro />
      <Audiences />
      <Impact />
      <Outreach />
      <Testimonials />
      <VisionValues />
      <Events />
      <Partners />
      <HomeFaq />
      <GetInvolvedCards />
      <Newsletter />
    </>
  );
}
