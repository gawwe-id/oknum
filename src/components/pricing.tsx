"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Crown, Star, Shield, Cpu } from "lucide-react";
import Link from "next/link";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.6,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 15,
      delay: custom * 0.1,
    },
  }),
  hover: (custom: number) => ({
    y: -10,
    scale: custom === 1 ? 1.05 : 1.02,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10,
    },
  }),
};

const checkmarkVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (custom: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 15,
      delay: 0.2 + custom * 0.05,
    },
  }),
};

// Interface for pricing plan
interface PricingPlan {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  highlight?: boolean;
  popular?: boolean;
  duration?: string;
}

// Pricing plans data
const pricingPlans: PricingPlan[] = [
  {
    id: 1,
    name: "Starter Package",
    price: "Rp1.500.000",
    description: "Mulai perjalanan digital UMKM Kamu dengan paket ini",
    features: [
      "1x Konsultasi bisnis & digital assessment",
      "Landing page sederhana & responsif",
      "Basic SEO setup",
      "Digital presence setup (Google Business)",
      "2 minggu support & maintenance",
    ],
    icon: <Star className="h-8 w-8 text-yellow-400" />,
    duration: "1-2 minggu",
  },
  {
    id: 2,
    name: "Growth Package",
    price: "Rp4.500.000",
    description: "Paket terpopuler untuk UMKM yang siap scale up",
    features: [
      "3x Konsultasi strategy session",
      "Company profile website/simple app",
      "Digital ads setup (Google/Meta)",
      "Content strategy & copywriting",
      "1 bulan consulting support",
      "Analytics & reporting dashboard",
    ],
    icon: <Shield className="h-8 w-8 text-sky-700" />,
    highlight: true,
    popular: true,
    duration: "3-4 minggu",
  },
  {
    id: 3,
    name: "Scale Package",
    price: "Rp8.500.000",
    description: "Solusi lengkap untuk UMKM menengah yang ingin bertumbuh",
    features: [
      "Comprehensive business audit",
      "Custom web/mobile app development",
      "AI/Automation implementation",
      "Digital marketing strategy & execution",
      "3 bulan consulting support",
      "Monthly growth review sessions",
    ],
    icon: <Crown className="h-8 w-8 text-purple-500" />,
    duration: "1.5-2 bulan",
  },
  {
    id: 4,
    name: "Enterprise Package",
    price: "Rp15.000.000",
    description: "Transformasi digital penuh untuk SME & enterprise",
    features: [
      "Full digital transformation consulting",
      "Complex app/platform development",
      "Complete automation suite",
      "Dedicated consulting team",
      "6 bulan+ consulting & support",
      "Priority support & custom features",
      "Quarterly business review",
    ],
    icon: <Cpu className="h-8 w-8 text-red-500" />,
    duration: "3+ bulan",
  },
];

// Pricing card component
interface PricingCardProps {
  plan: PricingPlan;
  index: number;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  return (
    <motion.div
      className={`relative h-full ${
        plan.highlight ? "lg:-mt-8 lg:mb-8 z-10" : "z-0"
      }`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={plan.highlight ? 1 : 0}
    >
      {plan.popular && (
        <motion.div
          className="absolute -top-6 inset-x-0 flex justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="px-4 py-1 bg-linear-to-r from-sky-700 to-sky-500 text-white text-sm font-semibold rounded-tr-2xl rounded-tl-2xl shadow-md">
            Paling Populer
          </span>
        </motion.div>
      )}

      <div
        className={`relative h-full rounded-2xl overflow-hidden ${
          plan.highlight
            ? "border-2 border-sky-700 shadow-xl bg-white"
            : "border border-gray-200 shadow-md bg-white"
        }`}
      >
        {plan.highlight && (
          <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-sky-700 to-sky-500" />
        )}

        <div className="p-6 md:p-8 h-full">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`p-2 rounded-lg ${
                plan.highlight ? "bg-sky-100" : "bg-gray-100"
              }`}
            >
              {plan.icon}
            </div>
            <h3
              className={`text-2xl font-black ${
                plan.highlight ? "text-sky-700" : "text-gray-700"
              }`}
            >
              {plan.name}
            </h3>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <p className="text-gray-600 font-bold text-xs">Mulai dari</p>
            <div className="flex items-baseline mb-1">
              <span
                className={`text-3xl font-bold ${
                  plan.highlight ? "text-sky-700" : "text-gray-800"
                }`}
              >
                {plan.price}
              </span>
              <span className="ml-1 text-gray-500">/project</span>
            </div>
            {plan.duration && (
              <div className="text-sm text-gray-500">
                Estimasi waktu: {plan.duration}
              </div>
            )}
          </div>

          <hr className="my-6 border-gray-200" />

          <div className="space-y-3">
            {plan.features.map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-start space-x-3"
                variants={checkmarkVariants}
                custom={i}
              >
                <div
                  className={`shrink-0 p-1 rounded-full mt-0.5 ${
                    plan.highlight
                      ? "bg-sky-100 text-sky-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span className="text-gray-700 text-sm md:text-base">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.button
            className={`w-full py-3 mt-8 rounded-lg font-medium transition-colors ${
              plan.highlight
                ? "bg-linear-to-r from-sky-700 to-sky-500 hover:from-sky-600 hover:to-sky-400 text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {plan.highlight ? "Pilih Paket Ini" : "Lihat Detail"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Main pricing section component
const Pricing: React.FC = () => {
  return (
    <motion.section
      className="py-20 from-gray-50 to-white overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto max-w-8xl px-4">
        <motion.div className="text-center mb-12" variants={headingVariants}>
          <motion.span
            className="inline-block px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-medium mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            Pricing Plan
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Investasi Terbaik untuk Pertumbuhan UMKM
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Paket konsultasi & development yang dirancang khusus untuk UMKM
            Indonesia. Semua paket include konsultasi strategy session.
            Project-based, tanpa biaya bulanan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-24">
          <AnimatePresence mode="wait">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={plan.id} plan={plan} index={index} />
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          className="mt-16 text-center max-w-6xl mx-auto bg-sky-50 p-8 rounded-2xl border border-sky-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-sky-800 mb-4">
            Butuh Konsultasi Khusus?
          </h3>
          <p className="text-sky-700 opacity-80 mb-6 max-w-3xl mx-auto">
            Setiap bisnis punya kebutuhan unik. Kami siap merancang paket custom
            yang sesuai dengan goals dan budget UMKM Kamu. Konsultasi pertama
            gratis!
          </p>
          <Link href={"/contact"}>
            <motion.button
              className="px-6 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Hubungi Kami</span>
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
      </div>
    </motion.section>
  );
};

export default Pricing;
