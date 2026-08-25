// Real contact details. This is the ONLY file that should ever contain the
// agency's email/phone/handle — every component that displays contact info
// imports from here. Page-specific copy for /start lives in content/start.ts.
//
// TODO: swap for the arcone.agency domain email once it exists, and for
// the agency's business phone if different from the founder's.

export const contactInfo = {
  email: "Karimsobieh@gmail.com",
  // Stored in a dialable international format; `phoneDisplay` is what's
  // shown on the page.
  phone: "+201018822211",
  phoneDisplay: "010 1882 2211",
  // wa.me needs the number with no leading "+" and no spaces.
  whatsapp: "https://wa.me/201018822211",
  instagram: "https://instagram.com/arcone.eg",
  location: "Cairo, Egypt",
};
