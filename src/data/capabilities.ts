export type Capability = {
  area: string;
  level: number;
  blurb: string;
  tools: string[];
};

export const capabilities: Capability[] = [
  {
    area: "Brand Identity",
    level: 98,
    blurb: "Logotypes, marks, type stacks, photography direction, motion principles.",
    tools: ["Glyphs", "Figma", "Illustrator", "After Effects"],
  },
  {
    area: "Creative Direction",
    level: 96,
    blurb: "Quarterly creative roadmaps, channel-ready output, on-set art direction.",
    tools: ["Notion", "Frame.io", "Capture One", "Loom"],
  },
  {
    area: "Fashion Direction",
    level: 94,
    blurb: "Lookbooks, capsule storytelling, casting, styling edits, on-set production.",
    tools: ["Capture One", "Photoshop", "Lightroom", "Issuu"],
  },
  {
    area: "Digital Product",
    level: 92,
    blurb: "Award-grade flagship sites, scroll-driven storytelling, motion systems.",
    tools: ["Figma", "Webflow", "Framer", "Vite + React"],
  },
  {
    area: "Editorial Design",
    level: 90,
    blurb: "Magazines, catalogs, broadsides, type-led longform, print + screen pairings.",
    tools: ["InDesign", "Photoshop", "Illustrator"],
  },
  {
    area: "Strategy & Voice",
    level: 88,
    blurb: "Positioning, naming, verbal identity, brand guidelines, voice & tone.",
    tools: ["Notion", "Workshops", "Audience Maps"],
  },
  {
    area: "Motion Design",
    level: 86,
    blurb: "Title sequences, social rolls, product walkthroughs, interaction specs.",
    tools: ["After Effects", "Cavalry", "Lottie", "Rive"],
  },
  {
    area: "Performance Marketing",
    level: 82,
    blurb: "Channel-aware creative, paid direction, A/B asset systems, dashboards.",
    tools: ["Meta", "Google Ads", "Looker", "ConvertKit"],
  },
];

export const stack = [
  { label: "Type", items: ["Söhne", "Editorial New", "Söhne Mono", "GT Sectra"] },
  { label: "Photo", items: ["Hannelore Vandenbussche", "Tyler Mitchell", "Wolfgang Tillmans"] },
  { label: "Tools", items: ["Figma", "Glyphs", "After Effects", "Capture One", "Webflow", "Notion"] },
  { label: "Cameras", items: ["Hasselblad H6D", "Pentax 67", "iPhone 15 Pro"] },
];
