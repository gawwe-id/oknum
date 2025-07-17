import { Metadata } from "next";
import { lexend } from "../fonts";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { constructMetadata } from "@/lib/seo";
import JsonLd, { organizationJsonLd, websiteJsonLd } from "@/components/JsonLd";
import PricingView from "@/views/pricing";

export const metadata: Metadata = constructMetadata({
  title: "Harga Layanan | Oknum Studio",
  description:
    "Pilih paket layanan digital yang sesuai dengan kebutuhan dan anggaran bisnis Anda. Kami menawarkan solusi yang komprehensif dan terjangkau.",
  keywords: [
    "harga website",
    "paket website",
    "jasa pembuatan aplikasi",
    "biaya pengembangan web",
    "digital agency Indonesia",
  ],
  pathname: "/pricing",
});

export default function PricingPage() {
  return (
    <main className={`min-h-screen ${lexend.className}`}>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <Navbar />

      <PricingView />

      <Footer />
    </main>
  );
}
