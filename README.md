# Mariya Akter — Portfolio

Personal portfolio website for Mariya Akter (https://mariyaakter.me), a multidisciplinary designer working across fashion, brand identity, and digital marketing.

Built from a Figma design as an 11-page editorial site.

## Tech stack

- Vite + React 19 + TypeScript
- Tailwind CSS 3
- React Router v7
- Playfair Display (Google Fonts) + Inter

## Pages

- `/` — Home / Hero
- `/work` — Work Gallery
- `/work/:slug` — Case Study (Aura Digital reference build)
- `/archive` — Project Archive (filterable)
- `/expertise` — Capabilities & Method
- `/services` — Services & Pricing Tiers
- `/about` — About Mariya + Contact form
- `/journal` — Thoughts & Perspectives
- `/contact` — Get In Touch
- `/privacy` — Privacy & Terms
- `*` — 404

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build to ./dist
npm run preview      # serve production build
```

## Deployment

The site is a static SPA. Any static host works (Vercel, Netlify, Cloudflare Pages, S3+CloudFront).

For SPA routing, configure all unknown routes to fall back to `/index.html`.

## Customizing

- Project entries: `src/data/projects.ts`
- Journal posts: `src/data/journal.ts`
- Tailwind palette: `tailwind.config.js` (`cream`, `ink`, `accent`)
- Hero / about photos: `src/pages/Home.tsx`, `src/pages/About.tsx`
