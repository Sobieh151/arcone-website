// Portfolio data. Adding a new case study requires nothing but a new
// object in this array — every list, card, and case-study page template
// reads from here.
//
// Mixed roster right now: north-atlas/fielder/marrow/harbor-co are
// fictional case studies (fake clients AND fake numbers) standing in
// until real project data exists; sensi/nawel-space are real,
// confirmed clients whose case-study copy is still [[ placeholder ]]
// pending the actual write-up. Don't invent specifics for the real
// ones the way the fictional entries get to — swap in the real
// challenge/strategy/execution/results, don't author new fake ones.

export type Project = {
  slug: string;
  name: string;
  category: string;
  industry: string;
  year: string;
  summary: string;
  services: string[];
  challenge: string;
  strategy: string;
  execution: string;
  results: { label: string; value: string }[];
  color: string;
  // Case-study preview slider (components/portfolio/work-slider.tsx) —
  // undefined for now, falls back to generated placeholder gradients.
  // Real photography drops in here as a plain array of image paths.
  previewImages?: string[];
};

export const projects: Project[] = [
  {
    slug: "north-atlas",
    name: "North Atlas",
    category: "Branding",
    industry: "Private Equity",
    year: "2025",
    summary: "Repositioning a private equity firm as the category's most trusted name.",
    services: ["Brand Identity", "Website", "Art Direction"],
    challenge:
      "North Atlas had the returns, but not the reputation. Their brand looked like every other firm in the room — same navy, same stock photography, same forgettable pitch deck.",
    strategy:
      "We stripped the identity down to a single idea: certainty. Every surface, from the wordmark to the motion language, was built to feel inevitable rather than decorative.",
    execution:
      "A new identity system, a cinematic one-page site built for capital raises, and a pitch deck template partners actually enjoy using.",
    results: [
      { label: "Capital raised post-launch", value: "$40M" },
      { label: "Time on site", value: "+310%" },
      { label: "Investor meetings booked", value: "2.4x" },
    ],
    color: "#E85002",
  },
  {
    // Real client — case-study copy below is still placeholder pending
    // the actual write-up; don't invent numbers or specifics for a real
    // name the way the fictional entries below get to.
    slug: "sensi",
    name: "Sensi",
    category: "Campaign",
    industry: "[[ Sensi — industry ]]",
    year: "2025",
    summary: "[[ Sensi — one-sentence summary ]]",
    services: ["[[ Service ]]", "[[ Service ]]"],
    challenge: "[[ Sensi — challenge ]]",
    strategy: "[[ Sensi — strategy ]]",
    execution: "[[ Sensi — execution ]]",
    results: [
      { label: "[[ Result ]]", value: "[[ — ]]" },
      { label: "[[ Result ]]", value: "[[ — ]]" },
    ],
    color: "#D14D02",
  },
  {
    // Real client — same placeholder-copy note as Sensi above.
    slug: "nawel-space",
    name: "Nawel Space",
    category: "Digital",
    industry: "[[ Nawel Space — industry ]]",
    year: "2025",
    summary: "[[ Nawel Space — one-sentence summary ]]",
    services: ["[[ Service ]]", "[[ Service ]]"],
    challenge: "[[ Nawel Space — challenge ]]",
    strategy: "[[ Nawel Space — strategy ]]",
    execution: "[[ Nawel Space — execution ]]",
    results: [
      { label: "[[ Result ]]", value: "[[ — ]]" },
      { label: "[[ Result ]]", value: "[[ — ]]" },
    ],
    color: "#B33A02",
  },
  {
    slug: "fielder",
    name: "Fielder",
    category: "Web & App",
    industry: "Logistics",
    year: "2025",
    summary: "Turning a logistics startup's product into its best sales asset.",
    services: ["Product Design", "Marketing Site", "Content Strategy"],
    challenge:
      "Fielder's product was excellent. Nobody outside their existing customers knew it existed. Marketing had been treated as an afterthought bolted onto engineering.",
    strategy:
      "We rebuilt the funnel around demonstration, not description. Show the product doing the hard part in the first five seconds, or lose the visitor.",
    execution:
      "A new site architecture, an interactive product demo embedded in the homepage, and a lifecycle email system that replaced their sales deck.",
    results: [
      { label: "Demo requests", value: "+184%" },
      { label: "Sales cycle", value: "-35%" },
      { label: "Organic traffic", value: "3.1x" },
    ],
    color: "#FF6001",
  },
  {
    slug: "marrow",
    name: "Marrow",
    // Was "Media & Activations" — that service was renamed to
    // "Activations" (content/services.ts); kept in sync so this still
    // matches a real filter button on /work instead of silently falling
    // out of every category but "All".
    category: "Activations",
    industry: "Nutrition & Wellness",
    year: "2024",
    summary: "Launching a nutrition brand into a category built on noise.",
    services: ["Brand Identity", "Packaging", "Launch Campaign"],
    challenge:
      "The supplements category is loud, cheap-looking, and mistrustful by default. Marrow needed to look like it belonged on a different shelf entirely.",
    strategy:
      "Borrow the visual language of pharmaceuticals and fine goods, not fitness influencers. Let the product speak in a register nobody else in the category uses.",
    execution:
      "Full identity system, packaging, a launch film, and a direct-to-consumer site built to convert first-time, skeptical buyers.",
    results: [
      { label: "Sell-through, week one", value: "92%" },
      { label: "Repeat purchase rate", value: "48%" },
      { label: "Press features", value: "14" },
    ],
    color: "#C13001",
  },
  {
    slug: "harbor-co",
    name: "Harbor & Co.",
    category: "Digital Marketing",
    industry: "Professional Services",
    year: "2024",
    summary: "Rebuilding a 40-year-old firm's digital presence without losing its credibility.",
    services: ["Website", "SEO Architecture", "Content"],
    challenge:
      "Harbor's reputation was built over four decades. Their website, built in 2011, was actively costing them new business.",
    strategy:
      "Modernize the surface without diluting the institutional weight. Speed, clarity and structured content over cleverness.",
    execution:
      "A new site rebuilt for Core Web Vitals, a content architecture designed around decision-maker search intent, and a design system their internal team could maintain.",
    results: [
      { label: "Organic leads", value: "+220%" },
      { label: "Page speed score", value: "98/100" },
      { label: "Keyword rankings, page 1", value: "3.6x" },
    ],
    color: "#9C3F0B",
  },
];
