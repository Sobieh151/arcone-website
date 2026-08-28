import { Hero } from "@/components/hero/hero";
import { DepartmentWork } from "@/components/services/department-work";
import { RealResults } from "@/components/sections/real-results";
import { AboutTeaser } from "@/components/about/about-teaser";
import { ContactCta } from "@/components/sections/contact-cta";

// Trusted By is rendered inside <Hero> (its own footer), not here — see
// hero.tsx.
//
// DepartmentWork replaces what used to be two separate sections here
// (ServicesTeaser's orbit, ExploreWork's carousel) with one continuous
// flow: pick a department, its real work slides in as a rail, click a
// project and it expands into a full gallery — no intermediate pages.
// /services/[slug] and /work/[slug] still exist as real, deep-linkable
// pages; they're just not part of this in-page flow any more.
//
// No Testimonials section — it only ever had three literal
// "[[ Client testimonial quote ]]" placeholders, and a fake testimonial
// reads worse than no testimonial at all. Add it back once there are
// real quotes to show.
export default function Home() {
  return (
    <>
      <Hero />
      <DepartmentWork />
      <RealResults />
      <AboutTeaser />
      <ContactCta />
    </>
  );
}
