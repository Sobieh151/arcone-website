import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { WorkList } from "@/components/portfolio/work-list";
import { ContactCta } from "@/components/sections/contact-cta";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected brand, web and campaign work for ambitious companies. Explore ARCone's case studies.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected Work"
        title="Work built to move numbers, not just moods."
        description="A selection of brand, product and campaign work for companies that treat design as leverage."
      />
      <WorkList />
      <ContactCta />
    </>
  );
}
