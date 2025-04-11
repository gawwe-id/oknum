import { Metadata } from "next";
import { lexend } from "../fonts";
import { constructMetadata } from "@/lib/seo";
import JsonLd, { createBreadcrumbJsonLd } from "@/components/JsonLd";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PrivacyPolicyView from "@/views/privacy-policy";

export const metadata: Metadata = constructMetadata({
  title: "Kebijakan Privasi",
  description:
    "Kebijakan Privasi Oknum menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.",
  keywords: [
    "kebijakan privasi",
    "privacy policy",
    "data protection",
    "keamanan data",
    "digital agency policy",
  ],
  pathname: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const breadcrumbData = createBreadcrumbJsonLd([
    { name: "Home", url: "https://oknum.studio" },
    { name: "Kebijakan Privasi", url: "https://oknum.studio/privacy-policy" },
  ]);

  return (
    <main className={`min-h-screen ${lexend.className}`}>
      <JsonLd data={breadcrumbData} />
      <Navbar />
      <PrivacyPolicyView />
      <Footer />
    </main>
  );
}
