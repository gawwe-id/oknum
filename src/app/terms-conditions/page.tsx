import { Metadata } from "next";
import { lexend } from "../fonts";
import { constructMetadata } from "@/lib/seo";
import JsonLd, { createBreadcrumbJsonLd } from "@/components/JsonLd";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TermsConditionsView from "@/views/terms-conditions";

export const metadata: Metadata = constructMetadata({
  title: "Syarat dan Ketentuan",
  description:
    "Syarat dan Ketentuan Oknum mengatur penggunaan layanan kami dan menjelaskan hak dan kewajiban Anda sebagai pengguna atau klien.",
  keywords: [
    "syarat dan ketentuan",
    "terms and conditions",
    "legal",
    "kebijakan layanan",
    "kontrak digital agency",
  ],
  pathname: "/terms-conditions",
});
export default function TermsConditionsPage() {
  const breadcrumbData = createBreadcrumbJsonLd([
    { name: "Home", url: "https://oknum.studio" },
    {
      name: "Syarat dan Ketentuan",
      url: "https://oknum.studio/terms-conditions",
    },
  ]);

  return (
    <main className={`min-h-screen ${lexend.className}`}>
      <JsonLd data={breadcrumbData} />
      <Navbar />
      <TermsConditionsView />
      <Footer />
    </main>
  );
}
