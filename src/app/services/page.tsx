import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ServicesList } from "@/components/services/services-list";
import { WhoWeWorkWith } from "@/components/services/who-we-work-with";
import { ContactCta } from "@/components/sections/contact-cta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital marketing, media production, branding, web & app, and media & activations — ARCone's five capabilities.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="[[ Services eyebrow ]]"
        title="[[ Services — headline ]]"
        description="[[ Services — one to two sentence description ]]"
      />
      <ServicesList />
      <WhoWeWorkWith />
      <ContactCta />
    </>
  );
}
