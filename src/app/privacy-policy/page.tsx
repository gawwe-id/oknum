import { lexend } from "../fonts";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PrivacyPolicyView from "@/views/privacy-policy";

export const metadata = {
  title: "Kebijakan Privasi | Oknum - Digital Agency",
  description:
    "Kebijakan Privasi Oknum. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className={`min-h-screen ${lexend.className}`}>
      <Navbar />
      <PrivacyPolicyView />
      <Footer />
    </main>
  );
}
