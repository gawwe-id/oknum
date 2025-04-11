import { Metadata } from "next";
import { lexend } from "../fonts";
import { constructMetadata } from "@/lib/seo";
import JsonLd, { createBreadcrumbJsonLd } from "@/components/JsonLd";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import RefundPolicyView from "@/views/refund-policy";

export const metadata: Metadata = constructMetadata({
  title: "Kebijakan Pengembalian Dana",
  description:
    "Kebijakan Pengembalian Dana Oknum menjelaskan prosedur, syarat, dan ketentuan terkait pengembalian dana untuk layanan yang kami sediakan.",
  keywords: [
    "kebijakan pengembalian dana",
    "refund policy",
    "pembatalan layanan",
    "garansi layanan",
    "pembayaran digital agency",
  ],
  pathname: "/refund-policy",
});

export default function RefundPolicyPage() {
  const breadcrumbData = createBreadcrumbJsonLd([
    { name: "Home", url: "https://oknum.studio" },
    {
      name: "Kebijakan Pengembalian Dana",
      url: "https://oknum.studio/refund-policy",
    },
  ]);

  return (
    <main className={`min-h-screen ${lexend.className}`}>
      <JsonLd data={breadcrumbData} />
      <Navbar />
      <RefundPolicyView />
      <Footer />
    </main>
  );
}
