import { Metadata } from "next";
import { lexend } from "./fonts";
import { constructMetadata } from "@/lib/seo";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import NotFoundContent from "@/views/not-found";

export const metadata: Metadata = constructMetadata({
  title: "Halaman Tidak Ditemukan",
  description:
    "Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.",
  noIndex: true, // Important for 404 pages
  pathname: "/not-found",
});

export default function NotFoundPage() {
  return (
    <main className={`min-h-screen ${lexend.className}`}>
      <Navbar />
      <NotFoundContent />
      <Footer />
    </main>
  );
}
