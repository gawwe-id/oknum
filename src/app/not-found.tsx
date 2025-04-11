import { lexend } from "./fonts";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import NotFoundContent from "@/views/not-found";

export default function NotFoundPage() {
  return (
    <main className={`min-h-screen ${lexend.className}`}>
      <Navbar />
      <NotFoundContent />
      <Footer />
    </main>
  );
}
