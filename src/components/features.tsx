"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  Handshake,
  Store,
  TrendingUp,
  Code2,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15,
      duration: 0.6,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
}) => (
  <motion.div
    className="bg-[#1A1A1A] rounded-lg p-8 border border-[#2A2A2A] hover:border-emerald-700 transition-colors"
    variants={itemVariants}
    whileHover={{ y: -5 }}
  >
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center w-12 h-12 mb-5 rounded-full bg-[#2A2A2A] text-emerald-700">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </motion.div>
);

// Features Component
const Features: React.FC = () => {
  return (
    <div className="w-full bg-[#121212] py-16 md:py-24">
      <motion.div
        className="container mx-auto max-w-6xl px-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Heading */}
        <motion.div className="text-center mb-16" variants={headingVariants}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Kenapa Pilih{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 transform -skew-x-6 bg-emerald-700 -z-10 rounded-sm" />
              <span className="relative z-0 text-white px-2">Oknum?</span>
            </span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Partner konsultasi & development yang fokus pada pertumbuhan bisnis
            UMKM Kamu dengan pendekatan yang terukur dan terpercaya.
          </p>
        </motion.div>

        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <FeatureCard
            title="Strategic Consulting"
            description="Konsultasi strategis untuk pertumbuhan bisnis yang terukur. Kami bantu identifikasi peluang dan solusi terbaik untuk UMKM Kamu."
            icon={<Target size={24} />}
          />

          <FeatureCard
            title="End-to-End Partnership"
            description="Partner dari konsultasi hingga implementasi & maintenance. Tidak cuma ngerjakan, tapi guide Kamu di setiap step."
            icon={<Handshake size={24} />}
          />

          <FeatureCard
            title="UMKM Focused"
            description="Paket dan solusi yang dirancang khusus untuk UMKM Indonesia. Harga transparan, tanpa hidden cost, project-based."
            icon={<Store size={24} />}
          />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Flexible & Scalable"
            description="Solusi yang grow bersama bisnis Kamu tanpa biaya bulanan. Bayar per project, scale kapan siap."
            icon={<TrendingUp size={24} />}
          />

          <FeatureCard
            title="Tech Expertise"
            description="Tim expert di web, mobile, AI, dan digital marketing. Teknologi modern dengan best practices industry."
            icon={<Code2 size={24} />}
          />

          <FeatureCard
            title="Business Growth Mindset"
            description="Fokus pada ROI dan pertumbuhan bisnis yang nyata. Setiap solusi dirancang untuk impact yang terukur."
            icon={<BarChart3 size={24} />}
          />
        </div>

        {/* Call to Action */}
        <motion.div className="text-center mt-16" variants={itemVariants}>
          <Link href="/contact">
            <motion.button
              className="px-6 py-3 bg-emerald-700 text-white rounded-lg font-medium hover:bg-[#307061] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Konsultasi Gratis Sekarang →
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Features;
