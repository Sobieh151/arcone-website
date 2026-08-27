import { Hero } from "@/components/hero/hero";
import { ExploreWork } from "@/components/portfolio/explore-work";
import { ServicesTeaser } from "@/components/services/services-teaser";
import { RealResults } from "@/components/sections/real-results";
import { AboutTeaser } from "@/components/about/about-teaser";
import { ContactCta } from "@/components/sections/contact-cta";

// Trusted By is rendered inside <Hero> (its own footer), not here — see
// hero.tsx.
//
// No Testimonials section — it only ever had three literal
// "[[ Client testimonial quote ]]" placeholders, and a fake testimonial
// reads worse than no testimonial at all. Add it back once there are
// real quotes to show.
export default function Home() {
  return (
    <>
      <Hero />
      <ExploreWork />
      <ServicesTeaser />
      <RealResults />
      <AboutTeaser />
      <ContactCta />
    </>
  );
}
