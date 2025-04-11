import { lexend } from "../fonts";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TermsConditionsView from "@/views/terms-conditions";

export const metadata = {
  title: "Syarat dan Ketentuan | Oknum - Digital Agency",
  description:
    "Syarat dan Ketentuan Oknum. Dokumen ini mengatur penggunaan layanan kami dan menjelaskan hak dan kewajiban Anda sebagai pengguna.",
};

export default function TermsConditionsPage() {
  return (
    <main className={`min-h-screen ${lexend.className}`}>
      <Navbar />
      <TermsConditionsView />
      <Footer />
    </main>
  );
}
