export type Award = {
  year: string;
  title: string;
  description: string;
  category: string;
  honor?: string;
};

export const awards: Award[] = [
  { year: "2024", title: "Awwwards", description: "Aura Digital launch site", category: "Digital", honor: "Site of the Day" },
  { year: "2024", title: "FWA", description: "Maison Carré digital flagship", category: "Digital", honor: "Site of the Day" },
  { year: "2024", title: "CSS Design Awards", description: "Velvet Silence — SS24 capsule", category: "Editorial", honor: "Special Kudos" },
  { year: "2024", title: "Brand New", description: "Notable identity work — Kinetics Lab", category: "Identity", honor: "Notable" },
  { year: "2023", title: "Type Directors Club", description: "Award of Typographic Excellence", category: "Typography", honor: "Excellence" },
  { year: "2023", title: "Dezeen Awards", description: "Brand Identity of the Year", category: "Identity", honor: "Longlist" },
  { year: "2023", title: "Awwwards", description: "Editor's Choice — Process page", category: "Digital", honor: "Editor's Choice" },
  { year: "2022", title: "European Design Awards", description: "Editorial Design — The Weaver's Paradox", category: "Editorial", honor: "Silver" },
  { year: "2022", title: "ADC Annual Awards", description: "Fashion Campaign — AW22", category: "Campaign", honor: "Merit" },
  { year: "2022", title: "Communication Arts", description: "Identity for Velvet & Co.", category: "Identity", honor: "Shortlist" },
  { year: "2021", title: "D&AD", description: "Wood Pencil — Editorial design", category: "Editorial", honor: "Wood Pencil" },
  { year: "2020", title: "Type Directors Club", description: "Logotype — Maison Carré", category: "Typography", honor: "Certificate" },
];

export type PressItem = {
  outlet: string;
  title: string;
  date: string;
  year: string;
  url: string;
  excerpt?: string;
  image?: string;
};

export const press: PressItem[] = [
  {
    outlet: "It's Nice That",
    title: "Mariya Akter on textiles, typography, and the threads in between",
    date: "Mar 2024",
    year: "2024",
    url: "#",
    excerpt: "An hour-long conversation about the studio's approach to brand identity at the intersection of cultural heritage and contemporary practice.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
  },
  {
    outlet: "AIGA Eye on Design",
    title: "Identity systems for fashion's quietest revolutionaries",
    date: "Feb 2024",
    year: "2024",
    url: "#",
    excerpt: "How a deliberately quiet design language became a competitive advantage for a generation of independent fashion houses.",
    image: "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=900&q=80",
  },
  {
    outlet: "The Brand Identity",
    title: "An interview with Mariya Akter on the studio model",
    date: "Jan 2024",
    year: "2024",
    url: "#",
    excerpt: "Inside the operating system of a small studio designing for global flagships.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80",
  },
  {
    outlet: "Sidebar",
    title: "Site of the Day — Aura Digital",
    date: "Nov 2023",
    year: "2023",
    url: "#",
    excerpt: "A study in what scroll storytelling can do when restraint is the loudest move on the page.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    outlet: "Brand New",
    title: "Noted: New identity for Velvet & Co.",
    date: "Sep 2023",
    year: "2023",
    url: "#",
    excerpt: "An identity that disappears into the room while keeping the room interesting.",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80",
  },
  {
    outlet: "Fonts In Use",
    title: "Featured: Editorial type direction in 'The Weaver's Paradox'",
    date: "Aug 2023",
    year: "2023",
    url: "#",
    excerpt: "Type as architecture, narrator, and texture across 96 spreads.",
    image: "https://images.unsplash.com/photo-1561998338-13ad7883b20f?auto=format&fit=crop&w=900&q=80",
  },
];
