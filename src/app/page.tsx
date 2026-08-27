import { Hero } from "@/components/hero/hero";
import { ExploreWork } from "@/components/portfolio/explore-work";
import { ServicesTeaser } from "@/components/services/services-teaser";
import { RealResults } from "@/components/sections/real-results";
import { AboutTeaser } from "@/components/about/about-teaser";
import { Testimonials } from "@/components/testimonials/testimonials";
import { ContactCta } from "@/components/sections/contact-cta";

// Trusted By is rendered inside <Hero> (its own footer), not here — see
// hero.tsx.
export default function Home() {
  return (
    <>
      <Hero />
      <ExploreWork />
      <ServicesTeaser />
      <RealResults />
      <AboutTeaser />
      <Testimonials />
      <ContactCta />
    </>
  );
}
