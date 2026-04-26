import { Helmet } from "react-helmet-async";

type Props = {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
};

const SITE = "https://mariyaakter.me";
const DEFAULT_DESC =
  "Mariya Akter — Multidisciplinary designer crafting intentional brand identities, fashion direction, and digital strategy. Studio in Dhaka, clients worldwide.";
const DEFAULT_IMAGE = `${SITE}/og-default.jpg`;

export default function Seo({ title, description, image, path }: Props) {
  const pageTitle = title ? `${title} — Mariya Akter` : "Mariya Akter — Portfolio";
  const desc = description ?? DEFAULT_DESC;
  const url = path ? `${SITE}${path}` : SITE;
  const img = image ?? DEFAULT_IMAGE;
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
