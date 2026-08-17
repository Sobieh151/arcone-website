import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/animations/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import { contactInfo, contactPage } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with ARCone. Tell us where the business is today, and where it needs to be.",
};

const info = [
  { icon: Mail, label: contactInfo.email, href: `mailto:${contactInfo.email}` },
  { icon: Phone, label: contactInfo.phoneDisplay, href: `tel:${contactInfo.phone}` },
  { icon: MapPin, label: contactInfo.location, href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        description={contactPage.description}
      />

      <section className="mx-auto max-w-6xl px-6 pb-32 sm:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="flex flex-col gap-10">
              <div>
                <span className="text-xs uppercase tracking-widest text-gray-medium">
                  Direct
                </span>
                <ul className="mt-4 flex flex-col gap-4">
                  {info.map((item) => (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          data-cursor-hover
                          className="inline-flex items-center gap-3 text-lg text-white transition-colors hover:text-orange-highlight"
                        >
                          <item.icon size={18} className="text-orange" />
                          {item.label}
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-3 text-lg text-white">
                          <item.icon size={18} className="text-orange" />
                          {item.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-gray-medium">
                  Response Time
                </span>
                <p className="mt-4 max-w-xs text-gray-light">
                  {contactPage.responseTime}
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-gray-medium">
                  Currently
                </span>
                <p className="mt-4 flex items-center gap-2 text-gray-light">
                  <span className="h-2 w-2 rounded-full bg-orange-highlight" />
                  {contactPage.availability}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
