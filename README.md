<div align="center">

# Mariya Akter — Portfolio

**Editorial portfolio for a multidisciplinary designer.**
Fashion direction · Brand identity · Digital craft.

[**mariyaakter.me**](https://mariyaakter.me) · [Live preview](https://dist-unddrkyd.devinapps.com)

![CI](https://github.com/mdhossain-2437/mariya-akter-portfolio/actions/workflows/ci.yml/badge.svg)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-0B0A09)

</div>

---

## Overview

An awwwards-calibre editorial site built from a Figma source of truth. Immersive motion system, light/dark with radial-reveal transitions, command palette with fuzzy search, multi-step inquiry flow with a serverless Resend-backed mail endpoint, and per-route SEO.

## Tech stack

| Layer            | Tool                                               |
| ---------------- | -------------------------------------------------- |
| Framework        | Vite 8 · React 19 · TypeScript 6                   |
| Styling          | Tailwind CSS 3 · CSS variables · custom tokens     |
| Routing          | React Router 7                                     |
| Motion           | Framer Motion · Lenis smooth scroll                |
| Search           | Fuse.js fuzzy match                                |
| SEO              | react-helmet-async · sitemap.xml · manifest.json   |
| Email (API)      | Resend (Vercel serverless function)                |
| Hosting          | Vercel (rewrites + headers via `vercel.json`)      |

## Project structure

```
api/
  contact.ts            Vercel serverless function – Resend email forwarding
public/                 Static assets, favicon set, robots.txt, sitemap.xml
src/
  components/           Reusable UI (Header, Footer, Cursor, ThemeRipple, …)
  context/              Theme provider + store
  data/                 Content sources (projects, journal, awards, …)
  pages/                Route pages (Home, Work, Contact, Journal, …)
  main.tsx              App entry
  index.css             Tailwind + design tokens
vercel.json             Build + rewrites + security headers
```

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → ./dist
npm run lint         # eslint
npm run preview      # serve production build locally
```

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (all environments):

| Variable               | Required | Description                                                       |
| ---------------------- | :------: | ----------------------------------------------------------------- |
| `RESEND_API_KEY`       | ✓        | Resend API key – [resend.com/api-keys](https://resend.com/api-keys) |
| `CONTACT_DESTINATION`  |          | Override inbox. Defaults to `misshossain2437@gmail.com`.          |
| `CONTACT_FROM`         |          | `Name <inbox@verified-domain>`. Defaults to `onboarding@resend.dev`. |

> Verify `mariyaakter.me` as a Resend sending domain to send `From: hello@mariyaakter.me` instead of the default sandbox sender.

## Deploying to Vercel

1. **Import** [`mdhossain-2437/mariya-akter-portfolio`](https://github.com/mdhossain-2437/mariya-akter-portfolio) on [vercel.com/new](https://vercel.com/new). Framework auto-detects as Vite.
2. Add `RESEND_API_KEY` under Settings → Environment Variables.
3. Attach the domain `mariyaakter.me` and `www.mariyaakter.me` under Settings → Domains.
4. Every push to `main` auto-deploys; PRs get preview URLs.

SPA refresh / direct-route loads are handled by the rewrite in [`vercel.json`](./vercel.json) that falls back to `index.html` for every non-API path.

## Content authoring

| Area              | File                              |
| ----------------- | --------------------------------- |
| Projects / work   | `src/data/projects.ts`            |
| Journal entries   | `src/data/journal.ts`             |
| Awards / press    | `src/data/awards.ts` / `press.ts` |
| Capabilities      | `src/data/capabilities.ts`        |
| FAQ               | `src/data/faq.ts`                 |
| Palette / tokens  | `tailwind.config.js`, `src/index.css` |

## Accessibility & performance

- Dark theme default with `prefers-color-scheme` support and no-flash preload script.
- `prefers-reduced-motion` respected (Lenis disabled, reveals collapsed).
- Skip-link, focus-visible rings, `role="alert"` on form errors, aria-labels on interactive elements.
- Images lazy-loaded with blur-up placeholder (`SmartImage`).
- Long-term asset caching (`Cache-Control: public, max-age=31536000, immutable`) via `vercel.json`.

## License

[MIT](./LICENSE) © Mariya Akter.
