import { Metadata } from "next";
import { lexend } from "../fonts";
import { constructMetadata } from "@/lib/seo";
import JsonLd, { createBreadcrumbJsonLd } from "@/components/JsonLd";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Contact from "@/views/contact";

export const metadata: Metadata = constructMetadata({
  title: "Hubungi Kami",
  description:
    "Butuh bantuan? Hubungi tim Oknum untuk konsultasi gratis. Kami siap membantu mewujudkan solusi digital terbaik untuk bisnis Anda.",
  keywords: [
    "kontak oknum",
    "hubungi kami",
    "digital agency contact",
    "konsultasi digital",
    "tangerang selatan",
  ],
  pathname: "/contact",
});

export default function ContactPage() {
  const breadcrumbData = createBreadcrumbJsonLd([
    { name: "Home", url: "https://oknum.studio" },
    { name: "Hubungi Kami", url: "https://oknum.studio/contact" },
  ]);

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Oknum Digital Agency",
    image: "https://oknum.studio/logo.png",
    telephone: "+62-812-1822-7597",
    email: "oknum.studio.team@gmail.com",
    url: "https://oknum.studio",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Lamtoro, Pamulang Barat",
      addressLocality: "Tangerang Selatan",
      addressRegion: "Banten",
      postalCode: "15418",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -6.222738,
      longitude: 106.682706,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
  };

  return (
    <main className={`min-h-screen ${lexend.className}`}>
      <JsonLd data={breadcrumbData} />
      <JsonLd data={localBusinessData} />
      <Navbar />
      <Contact />
      <Footer />
    </main>
  );
}
