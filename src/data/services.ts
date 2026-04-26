export type Service = {
  slug: string;
  title: string;
  blurb: string;
  bullets: string[];
  startingFrom?: string;
};

export const services: Service[] = [
  {
    slug: "brand-identity",
    title: "Brand Identity",
    blurb:
      "A complete visual language — from logotype to typography stack to motion principles — built to age beautifully and scale across every touchpoint.",
    bullets: [
      "Discovery & positioning workshop",
      "Logotype, monogram, secondary marks",
      "Typography system & type pairing",
      "Color, illustration, photography direction",
      "Brand guidelines + digital handoff",
    ],
    startingFrom: "$8,500",
  },
  {
    slug: "creative-direction",
    title: "Creative Direction",
    blurb:
      "End-to-end art direction for campaigns, lookbooks, and product launches — from moodboard to delivery, with a tactile editorial sensibility.",
    bullets: [
      "Concept & visual narrative",
      "Stylist, photographer, talent curation",
      "On-set art direction",
      "Edit, grade, and post supervision",
      "Channel-ready deliverables",
    ],
    startingFrom: "$6,000",
  },
  {
    slug: "fashion-direction",
    title: "Fashion Direction",
    blurb:
      "Collection-level direction for designers and houses — palette, fabric, silhouette, and storytelling refined into one cohesive seasonal voice.",
    bullets: [
      "Trend & cultural research",
      "Palette + textile sourcing direction",
      "Silhouette + collection storyboarding",
      "Lookbook art direction",
      "Showroom + runway choreography brief",
    ],
    startingFrom: "$7,200",
  },
  {
    slug: "digital-strategy",
    title: "Digital Strategy & Marketing",
    blurb:
      "Performance-aware digital strategy: site, paid, content, and CRM — designed to convert without compromising the brand.",
    bullets: [
      "Funnel & analytics audit",
      "Content + channel strategy",
      "Email / SMS lifecycle systems",
      "Paid creative direction",
      "Quarterly performance reviews",
    ],
    startingFrom: "$5,500 / mo",
  },
  {
    slug: "editorial-design",
    title: "Editorial & Print",
    blurb:
      "Magazines, lookbooks, monographs, and books — typography-led design for brands that want their print to feel like an artifact.",
    bullets: [
      "Concept + grid system",
      "Typesetting & micro-typography",
      "Image edit & sequence",
      "Print specs & paper sourcing",
      "Press supervision",
    ],
    startingFrom: "$4,200",
  },
  {
    slug: "digital-product",
    title: "Web & Digital Product",
    blurb:
      "Award-grade websites and digital experiences — engineered with editorial taste, performance, and accessibility from day one.",
    bullets: [
      "UX research & sitemap",
      "Visual + motion design",
      "Engineering oversight",
      "CMS, SEO, analytics",
      "Launch + ongoing iteration",
    ],
    startingFrom: "$12,500",
  },
];

export const addOns = [
  { title: "Brand Audit", price: "$1,800", note: "Standalone or pre-engagement diagnostic." },
  { title: "Naming", price: "$3,500", note: "Up to 12 directions, refined to 3." },
  { title: "Tagline / Verbal Identity", price: "$2,400", note: "Tone of voice, manifesto, taglines." },
  { title: "Sound Identity Brief", price: "$1,200", note: "Direction for composer collaboration." },
  { title: "Press Kit", price: "$1,500", note: "Editorial-ready brand assets." },
  { title: "Workshop / Talk", price: "$2,500", note: "Half-day, in-person or remote." },
];
