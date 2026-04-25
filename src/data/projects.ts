export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  cover: string;
  blurb: string;
  description?: string;
  duration?: string;
  role?: string;
  tools?: string;
  industry?: string;
  challenge?: string;
  challengeBody?: string;
  gallery?: { src: string; caption?: string; subcaption?: string; aspect?: string }[];
  stats?: { value: string; label: string; suffix?: string }[];
  next?: { title: string; slug: string };
};

export const projects: Project[] = [
  {
    slug: "aura-digital",
    title: "Aura Digital",
    category: "Creative Direction",
    year: "2024",
    cover:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=80",
    blurb:
      "A sensory-driven digital identity for a luxury fashion house redefining the boundaries of physical and virtual garments.",
    duration: "4 Months",
    role: "Creative Direction",
    tools: "Figma, C4D, Webflow",
    industry: "Digital Fashion",
    challenge:
      "How do we translate the tactile, high-touch experience of luxury atelier pieces into a purely digital environment without losing the \"soul\" of the garment?",
    challengeBody:
      "Aura Digital approached us to create a platform that didn't just sell clothes, but curated an emotional response. The interface needed to be as invisible as possible, allowing the hyper-detailed 3D renders to take center stage, while maintaining a sense of prestige through intentional white space and avant-garde typography.",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
        caption: "Materiality in Pixels",
        subcaption:
          "We developed a custom shader system that responds to mouse movement, mimicking the way light hits silk and leather in real-time.",
      },
      {
        src: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1200&q=80",
      },
      {
        src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    stats: [
      { value: "124", suffix: "%", label: "Engagement Increase" },
      { value: "40", suffix: "k", label: "Waitlist Signups" },
      { value: "02", suffix: "x", label: "Average Order Value" },
    ],
    next: { title: "Kinetics — Sports Lab", slug: "kinetics-sports-lab" },
  },
  {
    slug: "velvet-silence",
    title: "Velvet Silence",
    category: "Fashion Design",
    year: "2023",
    cover:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
    blurb:
      "A limited collection exploring the tactile relationship between raw silk and industrial concrete. Winner of the 2023 Creative Excellence Award.",
    next: { title: "Aura Digital", slug: "aura-digital" },
  },
  {
    slug: "neon-renaissance",
    title: "Neon Renaissance",
    category: "Digital Strategy",
    year: "2024",
    cover:
      "https://images.unsplash.com/photo-1517637382994-f02da38c6728?auto=format&fit=crop&w=1600&q=80",
    blurb:
      "Redefining digital presence for high-end boutique brands through minimalist storytelling and performance-driven data.",
    next: { title: "Aura Digital", slug: "aura-digital" },
  },
  {
    slug: "kinetics-sports-lab",
    title: "Kinetics — Sports Lab",
    category: "Brand Identity",
    year: "2024",
    cover:
      "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1600&q=80",
    blurb:
      "An identity system rooted in motion, friction, and the geometry of the body in performance.",
    next: { title: "Aura Digital", slug: "aura-digital" },
  },
  {
    slug: "the-weavers-paradox",
    title: "The Weaver's Paradox",
    category: "Fashion Design",
    year: "2024",
    cover:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "A draped textile study negotiating the line between sculptural form and wearable architecture.",
  },
  {
    slug: "aura-chronos",
    title: "Aura Chronos",
    category: "Product Design",
    year: "2024",
    cover:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    blurb:
      "A timepiece concept marrying precision craft with elemental, sun-cast materials.",
  },
  {
    slug: "metamorphosis",
    title: "Metamorphosis",
    category: "Visual Identity",
    year: "2023",
    cover:
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?auto=format&fit=crop&w=1200&q=80",
    blurb: "A metallic identity language built around skin, sheen and surface tension.",
  },
  {
    slug: "vogue-atelier",
    title: "Vogue Atelier Interior",
    category: "Creative Direction",
    year: "2024",
    cover:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    blurb: "Spatial direction for a flagship pop-up balancing brutalism with warmth.",
  },
  {
    slug: "future-of-retail",
    title: "The Future of Retail Experience",
    category: "Case Study",
    year: "2024",
    cover:
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80",
    blurb:
      "A comprehensive redesign of the digital-to-physical journey for a luxury heritage brand. Integrating AR fitting rooms with bespoke concierge services.",
  },
];

export const archiveProjects = [
  {
    slug: "silk-structure",
    title: "Silk & Structure",
    category: "Fashion Direction",
    year: "2024",
    cover:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[3/2]",
  },
  {
    slug: "the-brutalist-cut",
    title: "The Brutalist Cut",
    category: "Graphic Design",
    year: "2023",
    cover:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[4/5]",
  },
  {
    slug: "paper-trails",
    title: "Paper Trails",
    category: "Editorial Strategy",
    year: "2023",
    cover:
      "https://images.unsplash.com/photo-1457694716743-eb419114c894?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-square",
  },
  {
    slug: "liquid-marketing",
    title: "Liquid Marketing",
    category: "Digital Growth",
    year: "2022",
    cover:
      "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[3/4]",
  },
  {
    slug: "modern-museum",
    title: "Modern Museum",
    category: "Spatial Design",
    year: "2022",
    cover:
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[3/2]",
  },
  {
    slug: "couture-cipher",
    title: "Couture Cipher",
    category: "Brand Identity",
    year: "2023",
    cover:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    aspect: "aspect-[4/5]",
  },
];
