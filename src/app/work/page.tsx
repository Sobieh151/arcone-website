import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { WorkList } from "@/components/portfolio/work-list";
import { ContactCta } from "@/components/sections/contact-cta";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies across digital marketing, media production, branding, web & app, and media & activations.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="[[ Work eyebrow ]]"
        title="[[ Work — headline ]]"
        description="[[ Work — one to two sentence description ]]"
      />
      <WorkList />
      <ContactCta />
    </>
  );
}
