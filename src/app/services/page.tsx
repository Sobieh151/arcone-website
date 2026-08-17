import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ServicesList } from "@/components/services/services-list";
import { WhoWeWorkWith } from "@/components/services/who-we-work-with";
import { ContactCta } from "@/components/sections/contact-cta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Brand strategy & identity, website & product design, and social & performance creative — what ARCone does, for who, and why.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="What We Do"
        title="Three disciplines. One outcome."
        description="Every service exists to answer the same question: does this make the business impossible to ignore."
      />
      <ServicesList />
      <WhoWeWorkWith />
      <ContactCta />
    </>
  );
}
