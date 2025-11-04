import type { Metadata } from "next";
import "./globals.css";
import { constructMetadata } from "@/lib/seo";
import { ConvexClientProvider } from "@/lib/convex-provider";

export const metadata: Metadata = constructMetadata({
  title: "Oknum Studio | Tersangka Utama Kejayaan Brand Kamu",
  description:
    "Oknum Studio adalah digital agency yang menyediakan layanan pengembangan web, aplikasi mobile, dan solusi digital untuk membantu bisnis Anda tumbuh.",
  keywords: ["digital agency", "web development", "mobile app", "Indonesia"],
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://oknum.studio/#website",
      url: "https://oknum.studio",
      name: "Oknum Studio",
      description: "Creative Digital Agency Indonesia",
      potentialAction: [
        {
          "@type": "SearchAction",
          target: "https://oknum.studio/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      ],
      inLanguage: "id-ID",
    },
    {
      "@type": "Organization",
      "@id": "https://oknum.studio/#organization",
      name: "Oknum",
      url: "https://oknum.studio",
      logo: {
        "@type": "ImageObject",
        "@id": "https://oknum.studio/#logo",
        inLanguage: "id-ID",
        url: "https://oknum.studio/logo.png",
        contentUrl: "https://oknum.studio/logo.png",
        width: 500,
        height: 500,
        caption: "Oknum Studio - Digital Agency",
      },
      image: {
        "@id": "https://oknum.studio/#logo",
      },
      sameAs: [
        "https://facebook.com/oknumstudio",
        "https://twitter.com/oknumstudio",
        "https://instagram.com/oknumstudio",
        "https://linkedin.com/company/oknumstudio",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body suppressHydrationWarning>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
