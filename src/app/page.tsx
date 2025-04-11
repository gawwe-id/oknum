// app/page.tsx
import { lexend } from "./fonts";

import Hero from "@/components/vuehero";
import Navbar from "@/components/navbar";
import Services from "@/components/services";
import Portfolio from "@/components/portfolio";
import Clients from "@/components/clients";
import Features from "@/components/features";
import Pricing from "@/components/pricing";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className={`min-h-screen ${lexend.className}`}>
      <Navbar />
      <Hero />
      <Services />
      <Portfolio />
      <Clients />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}
