// Blog/Journal data. The structure supports everything a real post needs
// (SEO fields, categories, reading time, related-post linking via the
// slug list order) — populate more posts by adding objects here.
//
// TODO: these 6 posts are real, complete articles written to establish
// voice and prove the template — not filler. Keep, replace, or add to
// them as the content calendar develops.

export type BlogSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  body: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "great-branding-outperforms-bigger-budgets",
    title: "Why Great Branding Outperforms Bigger Marketing Budgets",
    excerpt:
      "Spend follows attention. Attention follows trust. Trust is built by design, long before the ad budget gets involved.",
    category: "Strategy",
    date: "2026-07-14",
    readTime: "6 min",
    body: [
      {
        paragraphs: [
          "Two companies can spend the same amount on ads and get wildly different results. The variable isn't the media plan. It's whether the brand earns a second look once it has the first.",
          "Most founders treat branding as the thing you do after the budget for growth is spent. That's backwards. Branding is what determines how far the growth budget goes.",
        ],
      },
      {
        heading: "The multiplier nobody puts in the spreadsheet",
        paragraphs: [
          "A distinct, well-crafted brand doesn't just look better — it lowers the cost of every dollar spent after it. People click more, trust faster, and forgive less when a company clearly knows what it's doing.",
          "We've watched clients cut ad spend after a rebrand and see conversion hold or climb, because the brand itself was doing work the media used to have to do alone.",
        ],
      },
      {
        heading: "Budget is a lever. Taste is a moat.",
        paragraphs: [
          "Bigger budgets are easy to copy. A competitor raises a round and outspends you next quarter. Taste is not something a competitor can wire into existence overnight.",
          "The companies that compound fastest aren't the ones spending the most. They're the ones whose spend goes further, quarter over quarter, because the brand underneath it keeps getting more valuable.",
        ],
      },
    ],
  },
  {
    slug: "hidden-cost-of-cheap-design",
    title: "The Hidden Cost of Cheap Design",
    excerpt:
      "Cheap design doesn't cost less. It costs later — in trust, in conversion, in every deal that walked before you got to speak.",
    category: "Strategy",
    date: "2026-06-02",
    readTime: "5 min",
    body: [
      {
        paragraphs: [
          "Cheap design has a way of hiding its price tag. There's no invoice for the customer who bounced in four seconds, or the investor who quietly decided you weren't ready.",
          "The cost shows up downstream — in a sales cycle that runs longer than it should, in a conversion rate that never quite gets explained, in the sense that the product is better than the company looks.",
        ],
      },
      {
        heading: "Perception is a filter, not a footnote",
        paragraphs: [
          "People don't evaluate your product and your design separately. They form one impression, fast, and everything after that is confirmation bias. A site that looks unfinished reads as a company that is unfinished, regardless of what's actually true.",
        ],
      },
      {
        heading: "What 'cheap' actually means",
        paragraphs: [
          "Cheap isn't a budget number — it's a design decision made without a point of view. Templates without editing. Stock photography that looks like everyone else's. Copy that explains instead of asserts.",
          "The fix isn't always more money. It's usually fewer, sharper decisions, made by someone willing to say no to the safe option.",
        ],
      },
    ],
  },
  {
    slug: "premium-brands-build-trust-before-conversation",
    title: "How Premium Brands Build Trust Before the First Conversation",
    excerpt:
      "By the time a prospect emails you, they've already decided how competent you are. Design made that decision for you.",
    category: "Brand",
    date: "2026-04-21",
    readTime: "7 min",
    body: [
      {
        paragraphs: [
          "Trust used to be built in the room — a handshake, a reference call, a slow accumulation of proof. Now most of it happens before anyone talks to a human at all.",
          "A prospect lands on your site, scrolls for eleven seconds, and forms a judgment that will color every conversation that follows. Premium brands treat that window as the most important sales moment they have, because it is.",
        ],
      },
      {
        heading: "Competence has a visual signature",
        paragraphs: [
          "Consistent spacing, considered typography, restraint where a less confident brand would over-explain — these aren't decoration. They're evidence. They tell a visitor, non-verbally, that the same rigor applied to the website was applied to the product.",
        ],
      },
      {
        heading: "Say less, prove more",
        paragraphs: [
          "The brands that build trust fastest tend to talk about themselves the least. They show outcomes, name specifics, and let restraint do the persuading that adjectives can't.",
          "By the time the first call happens, the prospect isn't evaluating whether you're credible. They're just confirming it.",
        ],
      },
    ],
  },
  {
    slug: "why-websites-dont-convert",
    title: "Why Websites Don't Convert (And What Actually Does)",
    excerpt:
      "It's rarely the copy. It's rarely the CTA color. It's almost always a lack of clarity about what you're actually selling.",
    category: "Growth",
    date: "2026-03-09",
    readTime: "8 min",
    body: [
      {
        paragraphs: [
          "Every underperforming site we've inherited had the same root cause, dressed up differently each time: the visitor couldn't tell, in the first five seconds, what the company actually does and who it's for.",
          "Teams respond to a weak conversion rate by testing button colors and swapping headlines. Those tests rarely move anything, because the problem isn't on the surface. It's structural.",
        ],
      },
      {
        heading: "Clarity beats cleverness, every time",
        paragraphs: [
          "A clever headline that requires a second read has already lost half the room. The best-converting pages we've built read like the plainest possible statement of value, said with total confidence.",
        ],
      },
      {
        heading: "One page, one job",
        paragraphs: [
          "Conversion drops whenever a page tries to do two things — explain the product and also justify the pricing and also build the brand and also handle objections. Each additional job dilutes the one job that matters for that visitor, at that moment.",
          "Fix the clarity problem before you fix anything else. Everything downstream of clarity is optimization. Everything upstream of it is guessing.",
        ],
      },
    ],
  },
  {
    slug: "psychology-behind-memorable-brands",
    title: "The Psychology Behind Memorable Brands",
    excerpt:
      "Memory is a byproduct of distinctiveness, not creativity for its own sake. Here's the difference, and why it matters.",
    category: "Brand",
    date: "2026-01-18",
    readTime: "6 min",
    body: [
      {
        paragraphs: [
          "Nobody remembers the brand that did everything correctly and nothing distinctly. Memory is built on contrast — the thing that didn't look, sound, or behave like everything around it.",
          "This is why category conventions are the enemy of memorability. If your logo, your palette, and your tone are indistinguishable from your three closest competitors, you haven't built a brand. You've built camouflage.",
        ],
      },
      {
        heading: "Distinctiveness is a discipline, not an accident",
        paragraphs: [
          "The brands people remember made specific, sometimes uncomfortable choices, and then repeated them relentlessly until the choice became recognizable on its own — a color, a shape, a sentence structure that's unmistakably theirs.",
        ],
      },
      {
        heading: "Consistency is what makes it compound",
        paragraphs: [
          "A distinctive idea used once is a nice moment. Used for five years without dilution, it becomes an asset a competitor cannot buy their way into. That's the actual goal — not being liked, but being unmistakable.",
        ],
      },
    ],
  },
  {
    slug: "design-is-not-decoration",
    title: "Design Is Not Decoration. It's Business.",
    excerpt:
      "Every design decision is a business decision wearing a different outfit. Treat it accordingly.",
    category: "Strategy",
    date: "2025-11-30",
    readTime: "5 min",
    body: [
      {
        paragraphs: [
          "Somewhere along the way, design got filed under 'nice to have' — the department that makes things pretty after the important decisions are already made. That's a costly misunderstanding.",
          "Every design choice is a business choice: what you emphasize, what you hide, what you charge, how fast someone can say yes. Treating it as decoration means those decisions get made by accident instead of on purpose.",
        ],
      },
      {
        heading: "The best operators already know this",
        paragraphs: [
          "The companies that treat design as a business function — not an art department — tend to out-execute competitors twice their size. Not because their product is better, but because every surface of the company is aligned toward the same outcome.",
        ],
      },
      {
        heading: "Bring design into the room earlier",
        paragraphs: [
          "If design enters the conversation after strategy is finished, it can only decorate a decision that's already been made. Bring it in at the start, and it becomes a way of making better decisions in the first place.",
        ],
      },
    ],
  },
];
