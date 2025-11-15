import { Metadata } from 'next';

import Hero from '@/components/vuehero';
import Navbar from '@/components/navbar';
import ClassesSection from '@/components/classes-section';
import WhyChooseClasses from '@/components/why-choose-classes';
import ClassFeatureLeft from '@/components/class-feature-left';
import ClassFeatureRight from '@/components/class-feature-right';
import ClassCTA from '@/components/class-cta';
import Footer from '@/components/footer';

import { constructMetadata } from '@/lib/seo';
import JsonLd, { organizationJsonLd, websiteJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = constructMetadata({
  title:
    'Oknum Studio | Kelas Eksklusif & Event Premium untuk Perkembangan Karir',
  description:
    'Investasi eksklusif network & experience melalui kelas premium dan event offline. Belajar langsung dari expert berpengalaman, bangun relasi berharga, dan dapatkan pengalaman belajar yang tak terlupakan.',
  keywords: [
    'kelas eksklusif',
    'event premium',
    'workshop offline',
    'kelas profesional',
    'networking event',
    'expert mentoring',
    'komunitas eksklusif',
    'pelatihan karir',
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
      <ClassesSection />
      <WhyChooseClasses />
      <ClassFeatureLeft
        badge="Pengalaman Belajar"
        title="Belajar dengan Metode Interaktif"
        description="Setiap sesi dirancang untuk memaksimalkan interaksi dan engagement. Diskusi langsung dengan expert, praktik real-world case, dan kolaborasi dengan peserta lain membuat pembelajaran lebih efektif dan berkesan."
        illustrationPath="/illustrations/mentoring.svg"
      />
      <ClassFeatureRight
        badge="Network & Komunitas"
        title="Bangun Relasi yang Berharga"
        description="Bergabung dengan komunitas eksklusif profesional yang sama-sama berkomitmen untuk berkembang. Networking session, sharing experience, dan kolaborasi jangka panjang yang bisa membuka peluang baru untuk karir kamu."
        illustrationPath="/illustrations/networking.svg"
      />
      <ClassCTA
        title="Siap Memulai Perjalanan Belajarmu?"
        description="Bergabunglah dengan kelas eksklusif kami dan dapatkan pengalaman belajar yang tak terlupakan bersama expert berpengalaman. Investasi terbaik untuk perkembangan karir kamu."
        primaryButtonText="Lihat Semua Kelas"
        primaryButtonLink="/exclusive-class"
      />
      <Footer />
    </main>
  );
}
