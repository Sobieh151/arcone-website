import { Hero } from "@/components/hero/hero";
import { TrustedBy } from "@/components/sections/trusted-by";
import { ExploreWork } from "@/components/portfolio/explore-work";
import { ServicesTeaser } from "@/components/services/services-teaser";
import { RealResults } from "@/components/sections/real-results";
import { AboutTeaser } from "@/components/about/about-teaser";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/testimonials/testimonials";
import { ContactCta } from "@/components/sections/contact-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <ExploreWork />
      <ServicesTeaser />
      <RealResults />
      <AboutTeaser />
      <Process />
      <Testimonials />
      <ContactCta />
    </>
  );
}
