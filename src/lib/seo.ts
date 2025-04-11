// src/lib/seo.ts
import type { Metadata } from "next";

type SeoProps = {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  pathname?: string;
};

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://oknum.studio";

export function constructMetadata({
  title,
  description,
  keywords = [],
  ogImage = "/og-image.jpg",
  noIndex = false,
  pathname = "",
}: SeoProps): Metadata {
  const metaTitle = `${title} | Oknum - Digital Agency`;
  const metaDescription = description;
  const url = `${baseUrl}${pathname}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      "digital agency",
      "web development",
      "mobile apps",
      "oknum",
      "indonesian agency",
      ...keywords,
    ],
    authors: [{ name: "Oknum Team" }],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
      languages: {
        id: `${url}-id`,
      },
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: url,
      title: metaTitle,
      description: metaDescription,
      siteName: "Oknum - Digital Agency",
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage.startsWith("http") ? ogImage : `${baseUrl}${ogImage}`],
      creator: "@oknumid",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google: "google-site-verification-code", // Replace with actual verification code
    },
  };
}
