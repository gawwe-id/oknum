"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Crown, Star, Shield, Cpu } from "lucide-react";

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
      type: "spring",
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
      type: "spring",
      stiffness: 70,
      damping: 15,
      delay: custom * 0.1,
    },
  }),
  hover: (custom: number) => ({
    y: -10,
    scale: custom === 1 ? 1.05 : 1.02,
    transition: {
      type: "spring",
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
      type: "spring",
      stiffness: 300,
      damping: 15,
      delay: 0.2 + custom * 0.05,
    },
  }),
};

// Billing period toggle component
interface BillingToggleProps {
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
}

const BillingToggle: React.FC<BillingToggleProps> = ({
  isYearly,
  setIsYearly,
}) => {
  return (
    <motion.div
      className="flex items-center justify-center mb-10 space-x-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <span
        className={`text-lg ${
          !isYearly ? "font-semibold text-blue-600" : "text-gray-500"
        }`}
      >
        Bulanan
      </span>
      <div
        className="relative w-16 h-8 bg-blue-100 rounded-full cursor-pointer"
        onClick={() => setIsYearly(!isYearly)}
      >
        <motion.div
          className="absolute w-6 h-6 bg-blue-600 rounded-full top-1"
          animate={{ x: isYearly ? 34 : 6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </div>
      <span
        className={`text-lg ${
          isYearly ? "font-semibold text-blue-600" : "text-gray-500"
        }`}
      >
        Tahunan
      </span>
      <motion.div
        className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full"
        animate={{
          scale: isYearly ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          times: [0, 0.5, 1],
          repeat: isYearly ? 1 : 0,
        }}
      >
        Hemat 20%
      </motion.div>
    </motion.div>
  );
};

// Interface for pricing plan
interface PricingPlan {
  id: number;
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  highlight?: boolean;
  popular?: boolean;
}

// Pricing plans data
const pricingPlans: PricingPlan[] = [
  {
    id: 1,
    name: "Oknum Jelata",
    monthlyPrice: "< 1jt",
    yearlyPrice: "< 10jt",
    description: "Cocok untuk personal website atau portofolio sederhana",
    features: [
      "Landing Page 1 Halaman",
      "1 Bahasa (Indonesia)",
      "Responsive Design",
      "Basic SEO Setup",
      "2 minggu Maintenance",
    ],
    icon: <Star className="h-8 w-8 text-yellow-400" />,
  },
  {
    id: 2,
    name: "Oknum Sipil",
    monthlyPrice: "1jt - 3jt",
    yearlyPrice: "10jt - 30jt",
    description: "Ideal untuk small business dan company profile",
    features: [
      "Company Profile",
      "Multiple Pages",
      "2 Bahasa (Indonesia & English/Chinese/etc)",
      "Contact Form",
      "Google Maps Integration",
      "1 bulan Maintenance",
    ],
    icon: <Shield className="h-8 w-8 text-emerald-700" />,
    highlight: true,
    popular: true,
  },
  {
    id: 3,
    name: "Oknum Aparat",
    monthlyPrice: "5jt++",
    yearlyPrice: "50jt++",
    description:
      "Solusi lengkap untuk bisnis menengah dengan kebutuhan e-commerce",
    features: [
      "Multi Bahasa (sesuai permintaan)",
      "Blog / E-Commerce",
      "Payment Gateway",
      "Analytics Dashboard",
      "Social Media Integration",
      "3 bulan Maintenance",
    ],
    icon: <Crown className="h-8 w-8 text-purple-500" />,
  },
  {
    id: 4,
    name: "Oknum Mentri",
    monthlyPrice: "10jt - unlimited",
    yearlyPrice: "100jt - unlimited",
    description: "Paket komprehensif untuk enterprise dan aplikasi kompleks",
    features: [
      "Mobile Apps (Android & iOS)",
      "SPA (Single Page Application)",
      "Database",
      "Admin Dashboard",
      "API Integration",
      "Custom Features Development",
      "Priority Support",
      "6 bulan Maintenance",
    ],
    icon: <Cpu className="h-8 w-8 text-red-500" />,
  },
];

// Pricing card component
interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
  index: number;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isYearly }) => {
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
          <span className="px-4 py-1 bg-gradient-to-r from-emerald-700 to-[#307061] text-white text-sm font-semibold rounded-tr-2xl rounded-tl-2xl shadow-md">
            Paling Populer
          </span>
        </motion.div>
      )}

      <div
        className={`relative h-full rounded-2xl overflow-hidden ${
          plan.highlight
            ? "border-2 border-emerald-700 shadow-xl bg-white"
            : "border border-gray-200 shadow-md bg-white"
        }`}
      >
        {plan.highlight && (
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-700 to-[#307061]" />
        )}

        <div className="p-6 md:p-8 h-full">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`p-2 rounded-lg ${
                plan.highlight ? "bg-[#d8e8e4]" : "bg-gray-100"
              }`}
            >
              {plan.icon}
            </div>
            <h3
              className={`text-xl font-bold ${
                plan.highlight ? "text-emerald-700" : "text-gray-800"
              }`}
            >
              {plan.name}
            </h3>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="flex items-baseline mb-2">
              <motion.span
                className={`text-3xl font-bold ${
                  plan.highlight ? "text-emerald-700" : "text-gray-900"
                }`}
                key={isYearly ? `${plan.id}-yearly` : `${plan.id}-monthly`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
              </motion.span>
              <span className="ml-1 text-gray-500">
                {isYearly ? "/tahun" : "/bulan"}
              </span>
            </div>
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
                  className={`flex-shrink-0 p-1 rounded-full mt-0.5 ${
                    plan.highlight
                      ? "bg-[#c4dcd7] text-emerald-700"
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
                ? "bg-gradient-to-r from-emerald-700 to-[#307061] hover:from-[#509887] hover:to-[#77afa1] text-white shadow-md"
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
  const [isYearly, setIsYearly] = useState<boolean>(false);

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
            className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            Pricing Plan
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pilih Paket Yang Sesuai Kebutuhan
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami menawarkan berbagai paket layanan pengembangan website dan
            aplikasi yang dapat disesuaikan dengan kebutuhan dan anggaran Kamu.
          </p>
        </motion.div>

        <BillingToggle isYearly={isYearly} setIsYearly={setIsYearly} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-24">
          <AnimatePresence mode="wait">
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isYearly={isYearly}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          className="mt-16 text-center max-w-6xl mx-auto bg-blue-50 p-8 rounded-2xl border border-blue-100"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-4">
            Butuh Solusi Custom?
          </h3>
          <p className="text-blue-700 opacity-80 mb-6 max-w-3xl mx-auto">
            Jika kebutuhan Kamu tidak tercakup dalam paket di atas, kami siap
            menyediakan solusi khusus yang dirancang spesifik untuk bisnis Kamu.
          </p>
          <motion.button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
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
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Pricing;
