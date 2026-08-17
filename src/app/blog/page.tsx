import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { BlogList } from "@/components/blog/blog-list";
import { ContactCta } from "@/components/sections/contact-cta";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on brand, design and growth for founders and operators who treat design as a business decision.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Journal"
        title="Ideas for people who build things."
        description="Notes on brand, design and growth — written for founders and operators, not designers."
      />
      <BlogList />
      <ContactCta />
    </>
  );
}
