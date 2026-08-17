import { contactInfo } from "@/content/contact";

export const privacyLastUpdated = "August 9, 2026";

export const privacySections = [
  {
    heading: "1. Information We Collect",
    body: "When you contact us through this site, we collect the information you provide directly — your name, email address, company, and any details you share about your project. We also collect standard analytics data (pages visited, general location, device type) to understand how the site is used.",
  },
  {
    heading: "2. How We Use Information",
    body: "We use the information you provide to respond to inquiries, scope potential projects, and — with your consent — send occasional updates about ARCone's work. We do not sell your information to third parties.",
  },
  {
    heading: "3. Cookies & Analytics",
    body: "This site may use cookies and similar technologies to understand aggregate traffic patterns and improve the experience. You can disable cookies in your browser settings at any time.",
  },
  {
    heading: "4. Data Retention",
    body: "We retain contact information for as long as necessary to respond to your inquiry or maintain an active client relationship, and delete it upon request.",
  },
  {
    heading: "5. Your Rights",
    body: `You may request access to, correction of, or deletion of your personal information at any time by contacting ${contactInfo.email}.`,
  },
  {
    heading: "6. Contact",
    body: `Questions about this policy can be directed to ${contactInfo.email}.`,
  },
];
