import { Helmet } from "react-helmet-async";

type Props = {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
};

const SITE = "https://mariyaakter.me";
const DEFAULT_IMAGE = `${SITE}/og-cover.jpg`;
const DEFAULT_DESC =
  "Mariya Akter — Multidisciplinary designer crafting intentional brand identities, fashion direction, and digital strategy. Studio in Dhaka, clients worldwide.";

// Helmet hoists its children to <head> on the client (React 19's metadata
// hoisting). The prerender script strips Helmet's emitted tags from the
// body so the static head wins, and the lazy-hydration loader keeps the
// hydration tree consistent. We render Helmet unconditionally so React
// can rehydrate per-route titles cleanly once it takes over.
export default function Seo({ title, description, image, path }: Props) {

  const pageTitle = title ? `${title} — Mariya Akter` : "Mariya Akter — Portfolio";
  const desc = description ?? DEFAULT_DESC;
  const url = path ? `${SITE}${path}` : SITE;
  const img = image
    ? image.startsWith("http")
      ? image
      : `${SITE}${image.startsWith("/") ? "" : "/"}${image}`
    : DEFAULT_IMAGE;
  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}
