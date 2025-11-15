'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  BookOpen,
  Award,
  Users,
  Clock,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
      duration: 0.6
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15
    }
  }
};

// Why Choose Card Component
interface WhyChooseCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const WhyChooseCard: React.FC<WhyChooseCardProps> = ({
  title,
  description,
  icon
}) => (
  <motion.div
    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-teal-500 hover:shadow-lg transition-all h-full"
    variants={itemVariants}
    whileHover={{ y: -5 }}
  >
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-teal-50 text-teal-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// Why Choose Our Classes Component
const WhyChooseClasses: React.FC = () => {
  const whyChooseData = [
    {
      icon: <UserCheck size={28} />,
      title: 'Expert Berpengalaman',
      description:
        'Belajar langsung dari praktisi yang sudah terbukti di industri. Mentor kami memiliki pengalaman bertahun-tahun dan siap membagikan insight berharga.'
    },
    {
      icon: <BookOpen size={28} />,
      title: 'Materi Terstruktur',
      description:
        'Kurikulum yang dirancang step-by-step untuk memastikan kamu memahami setiap konsep dengan baik. Dari dasar hingga advanced, semua terstruktur dengan jelas.'
    },
    {
      icon: <Award size={28} />,
      title: 'Experience yang Berkesan',
      description:
        'Setiap sesi dirancang untuk memberikan pengalaman belajar yang tak terlupakan. Interaksi langsung, diskusi mendalam, dan praktik nyata yang membuat pembelajaran lebih bermakna dan berkesan.'
    },
    {
      icon: <Users size={28} />,
      title: 'Network Eksklusif',
      description:
        'Bergabung dengan komunitas eksklusif peserta kelas. Connect dengan profesional lain, berbagi pengalaman, dan membangun relasi yang berharga.'
    },
    {
      icon: <Clock size={28} />,
      title: 'Kelas Offline Only',
      description:
        'Kelas ini diselenggarakan secara offline untuk memaksimalkan interaksi dan pengalaman belajar. Bertemu langsung dengan expert dan peserta lain, networking yang lebih kuat, dan atmosfer belajar yang lebih fokus.'
    },
    {
      icon: <Sparkles size={28} />,
      title: 'Dokumentasi & Video Sinematik',
      description:
        'Dapatkan dokumentasi lengkap dan video sinematik dari setiap sesi kelas. Rekaman berkualitas tinggi yang bisa kamu tonton kembali untuk memperdalam pemahaman dan mengingat kembali materi penting.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <motion.div
        className="container mx-auto max-w-6xl px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Heading */}
        <motion.div className="text-center mb-12" variants={headingVariants}>
          <motion.span
            className="inline-block px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            Kenapa Pilih Kelas Kami?
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Investasi Terbaik untuk{' '}
            <span className="relative inline-block">
              <span className="absolute inset-0 transform -skew-x-6 bg-teal-200 -z-10 rounded-sm" />
              <span className="relative z-0 text-teal-600 px-2">
                Perkembanganmu
              </span>
            </span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Kami menghadirkan pengalaman belajar yang berbeda dengan fokus pada
            kualitas, praktik nyata, dan hasil yang terukur untuk karir kamu.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {whyChooseData.map((item, index) => (
            <WhyChooseCard
              key={index}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div className="text-center" variants={itemVariants}>
          <Link href="/exclusive-class">
            <motion.button
              className="px-8 py-3 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition-colors shadow-sm inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Lihat Semua Kelas</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 10H15M15 10L10 5M15 10L10 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WhyChooseClasses;
