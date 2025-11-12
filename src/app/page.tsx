// app/page.tsx
import { Metadata } from 'next';

import Hero from '@/components/vuehero';
import Navbar from '@/components/navbar';
import Services from '@/components/services';
import Portfolio from '@/components/portfolio';
import Clients from '@/components/clients';
import Features from '@/components/features';
import Pricing from '@/components/pricing';
import ClassesSection from '@/components/classes-section';
import Footer from '@/components/footer';

import { constructMetadata } from '@/lib/seo';
import JsonLd, { organizationJsonLd, websiteJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = constructMetadata({
  title: 'Oknum Studio | Tersangka Utama Kejayaan Brand Kamu',
  description:
    'Kami adalah creator produk digital berkualitas dengan design yang intuitive dan performa optimal. Solusi digital terbaik untuk kebutuhan bisnis Anda.',
  keywords: [
    'web development',
    'mobile app',
    'UI/UX design',
    'digital agency Indonesia',
    'Tangerang Selatan'
  ],
  pathname: '/'
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <Navbar />
      <Hero />
      {/* <Services /> */}
      <ClassesSection />
      <Portfolio />
      <Clients />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}
