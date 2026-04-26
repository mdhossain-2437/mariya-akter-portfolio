export type JournalEntry = {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  hero: string;
  body: string[];
};

export const journalEntries: JournalEntry[] = [
  {
    slug: "architecture-of-silence",
    title: "The Architecture of Silence: Why Minimalism is Scaling Fast in Luxury Retail",
    category: "Fashion Strategy",
    date: "12 October 2024",
    readTime: "8 min",
    excerpt:
      "When the entire category shouts, the loudest move is restraint. A field study from three flagship reopenings.",
    hero: "https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=1800&q=80",
    body: [
      "Walk into a modern luxury flagship and you'll notice the silence first. Not the absence of sound — the absence of noise. Surfaces don't announce themselves. Type doesn't compete. Lighting performs no tricks. The room itself is the product, and the product becomes a guest.",
      "This isn't minimalism in the Helvetica sense. It's something closer to the Italian word sprezzatura — studied carelessness. A discipline of subtraction so refined it disappears, leaving only the inevitable behind.",
      "Three case studies surfaced this year that prove the method scales. Maison Carré stripped 60% of their visual assets between 2022 and 2024 and saw average order value climb 31%. Velvet & Co. cut their channel posts in half and grew engagement per post by 4×. Aura Digital reduced their site to fewer than ten primary surfaces and now ships pages with longer dwell time than any single piece of editorial they previously published.",
      "What unites them isn't aesthetic — it's editorial discipline. Each removed object had to defend its existence against a single question: does this make the brand more itself, or less? Most things lose that argument. The few that win become unforgettable.",
      "For founders considering this approach: the mistake is to confuse silence with absence. Silence is a presence. It must be designed, weighted, and held. Done well, it sells. Done poorly, it disappears.",
    ],
  },
  {
    slug: "typography-sole-narrator",
    title: "Typography as the Sole Narrator in Digital Storytelling",
    category: "Graphics",
    date: "28 September 2024",
    readTime: "6 min",
    excerpt:
      "Image-led design has a ceiling. Type, used as character rather than container, breaks through it.",
    hero: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1800&q=80",
    body: [
      "There's a moment in every digital project where the team will reach for stock imagery. Don't let them. Type can carry the entire emotional weight of a page if you treat it as a character with a voice, posture, and pace.",
      "Three principles govern this. First, type at scale. Most pages whisper because they set their headline at 48px. Try 240px and observe what happens to the room. Second, type with rhythm. Mix weights and italics inside a single sentence to give the eye somewhere to breathe. Third, type that moves. Even a 12px translateY on hover changes how the reader perceives the brand's confidence.",
      "Image is consumed. Type is read. The reader is doing the work, and that work is the relationship.",
    ],
  },
  {
    slug: "data-driven-elegance",
    title: "Data-Driven Elegance: Harmonizing Analytics with Avant-Garde Visuals",
    category: "Digital Strategy",
    date: "15 September 2024",
    readTime: "9 min",
    excerpt:
      "The best brands aren't choosing between intuition and instrumentation. They're using one to sharpen the other.",
    hero: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=80",
    body: [
      "There's a tired narrative that creative direction and conversion data live on opposite sides of a table. They don't. They live in the same chair, and the brands that figure this out are pulling away from the rest of the field at compounding rates.",
      "The trick isn't to A/B-test your way out of an aesthetic problem. It's to use data to identify the moments where the work isn't doing what you intended, and then to apply taste — not telemetry — to fix it.",
      "Data tells you that 78% of users abandon at the third scroll point. Taste tells you why. Maybe the typography lost momentum. Maybe the rhythm broke. Maybe the image stopped earning its position. None of those are A/B-testable in isolation, but all of them are addressable with disciplined design.",
      "The best directors I know read their dashboards every Monday and ignore them every Friday. They use data to ask better questions, not to answer them. The answer is always taste.",
    ],
  },
  {
    slug: "post-digital-aesthetic",
    title: "The Post-Digital Aesthetic: Reclaiming Tactility",
    category: "Future Trends",
    date: "01 September 2024",
    readTime: "7 min",
    excerpt:
      "Why a generation raised entirely on screens is forcing luxury brands back to grain, paper, and analog imperfection.",
    hero: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?auto=format&fit=crop&w=1800&q=80",
    body: [
      "There's a quiet rebellion happening across the lookbooks of next season. Brands that built their reputations on pixel-perfect renderings are introducing scanner glitches, paper texture, halftone dots, and grain. The aesthetic is post-digital — not anti-digital, but post.",
      "Post-digital design assumes that everyone in the room understands the digital condition implicitly. There's no need to demonstrate it. So the design moves on to the next question: what does it feel like to touch this brand? What does it feel like to hold it, fold it, or leave it on a coffee table?",
      "This isn't nostalgia. Nostalgia is for things you've lost. Tactility is for things you'd forgotten you needed. The screens didn't take that need away — they just outsourced it. Now it's coming home.",
    ],
  },
];
