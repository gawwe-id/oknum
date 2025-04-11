import { lexend } from "../fonts";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Contact from "@/views/contact";

export default function ContactPage() {
  return (
    <main className={`min-h-screen ${lexend.className}`}>
      <Navbar />
      <Contact />
      <Footer />
    </main>
  );
}
