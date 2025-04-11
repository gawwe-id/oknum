import { lexend } from "../fonts";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import RefundPolicyView from "@/views/refund-policy";

export const metadata = {
  title: "Kebijakan Pengembalian Dana | Oknum - Digital Agency",
  description:
    "Kebijakan Pengembalian Dana Oknum. Dokumen ini menjelaskan prosedur, syarat, dan ketentuan terkait pengembalian dana untuk layanan yang kami sediakan.",
};

export default function RefundPolicyPage() {
  return (
    <main className={`min-h-screen ${lexend.className}`}>
      <Navbar />
      <RefundPolicyView />
      <Footer />
    </main>
  );
}
