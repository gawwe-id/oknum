"use client";

import { usePathname } from "next/navigation";
import Head from "next/head";
import { baseUrl } from "@/lib/seo";

interface SeoProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  twitter?: {
    cardType?: "summary" | "summary_large_image";
    site?: string;
  };
  canonicalUrl?: string;
  children?: React.ReactNode;
}

// This component can be used for dynamic SEO needs in client components
export default function Seo({
  title = "Oknum Studio | Tersangka Utama Kejayaan Brand Kamu",
  description = "Digital Agency Indonesia dengan fokus pada web development, mobile apps, dan solusi digital.",
  ogImage = "/og-image.jpg",
  ogType = "website",
  twitter = {
    cardType: "summary_large_image",
    site: "@oknumstudio",
  },
  canonicalUrl,
  children,
}: SeoProps) {
  const pathname = usePathname();
  const pageUrl = canonicalUrl || `${baseUrl}${pathname}`;
  const ogImageUrl = ogImage.startsWith("http")
    ? ogImage
    : `${baseUrl}${ogImage}`;

  return (
    <Head>
      {/* This component is intended for client components that need dynamic SEO values */}
      {/* For static SEO, use the Next.js Metadata API in your page.tsx files */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitter.cardType} />
      <meta name="twitter:site" content={twitter.site} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {children}
    </Head>
  );
}
