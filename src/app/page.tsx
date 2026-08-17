import { Hero } from "@/components/hero/hero";
import { ServicesTeaser } from "@/components/services/services-teaser";
import { WorkPreview } from "@/components/portfolio/work-preview";
import { AboutTeaser } from "@/components/about/about-teaser";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/testimonials/testimonials";
import { ContactCta } from "@/components/sections/contact-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesTeaser />
      <WorkPreview />
      <AboutTeaser />
      <Process />
      <Testimonials />
      <ContactCta />
    </>
  );
}
