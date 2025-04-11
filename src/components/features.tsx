"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Users, Clock, Lightbulb, Globe } from "lucide-react";

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
            Kami membuat produk digital{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 transform -skew-x-6 bg-emerald-700 -z-10 rounded-sm" />
              <span className="relative z-0 text-white px-2">
                yang terbaik!
              </span>
            </span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Oknum hadir dengan keunggulan yang akan membuat brand Kamu lebih
            bersinar di dunia digital.
          </p>
        </motion.div>

        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <FeatureCard
            title="Performa Optimal"
            description="Website dan aplikasi yang cepat, responsif, dan optimal di semua perangkat untuk pengalaman pengguna terbaik."
            icon={<Zap size={24} />}
          />

          <FeatureCard
            title="Keamanan Terjamin"
            description="Implementasi standar keamanan terkini untuk melindungi data dan privasi pengguna dari berbagai ancaman."
            icon={<Shield size={24} />}
          />

          <FeatureCard
            title="Berpusat Pada Pengguna"
            description="Desain intuitif yang memudahkan pengguna, meningkatkan engagement, dan mengoptimalkan konversi."
            icon={<Users size={24} />}
          />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="Support Responsif"
            description="Tim dukungan yang siap membantu Kamu kapan saja dengan solusi cepat untuk setiap masalah."
            icon={<Clock size={24} />}
          />

          <FeatureCard
            title="Solusi Inovatif"
            description="Teknologi terkini dan pendekatan kreatif untuk membuat produk digital yang unik dan memukau."
            icon={<Lightbulb size={24} />}
          />

          <FeatureCard
            title="Jangkauan Global"
            description="Membantu produk Kamu mencapai pasar internasional dengan dukungan multi bahasa dan SEO yang kuat."
            icon={<Globe size={24} />}
          />
        </div>

        {/* Call to Action */}
        <motion.div className="text-center mt-16" variants={itemVariants}>
          <motion.button
            className="px-6 py-3 bg-emerald-700 text-white rounded-lg font-medium hover:bg-[#307061] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Mulai Kerjasama Sekarang →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Features;
