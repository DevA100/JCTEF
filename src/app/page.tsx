import { AboutIntro } from "@/components/sections/about-intro";
import { Audiences } from "@/components/sections/audiences";
import { Events } from "@/components/sections/events";
import { GetInvolvedCards } from "@/components/sections/get-involved-cards";
import { Hero } from "@/components/sections/hero";
import { Impact } from "@/components/sections/impact";
import { Journey } from "@/components/sections/journey";
import { Newsletter } from "@/components/sections/newsletter";
import { Partners } from "@/components/sections/partners";
import { VisionValues } from "@/components/sections/vision-values";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutIntro />
      <Journey />
      <Audiences />
      <Impact />
      <VisionValues />
      <Events />
      <Partners />
      <GetInvolvedCards />
      <Newsletter />
    </>
  );
}
