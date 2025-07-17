"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Share2,
  Smartphone,
  Globe,
  Sparkles,
  Rocket,
  ArrowRight,
  LayoutDashboard,
  MessagesSquare,
  LucideIcon,
  Bot,
  Megaphone,
  ShoppingCart,
  Zap,
  Target,
  TrendingUp,
  CreditCard,
  Package,
  Users,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Animation variants
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.5,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    y: -10,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const featureItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// TypeScript interfaces
interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
}

interface FeatureType {
  icon: LucideIcon;
  text: string;
}

type ColorType = "teal" | "blue" | "purple" | "orange" | "green";

interface ColorStyles {
  [key: string]: {
    bgGradient: string;
    iconBg: string;
    borderColor: string;
    textColor: string;
    lightTextColor: string;
    buttonBg: string;
    tagBg: string;
  };
}

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: ColorType;
  features: FeatureType[];
  ctaText?: string;
  technologies: string[];
}

type ServiceType = ServiceCardProps;

// Feature list component
const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => (
  <motion.div
    className="flex items-center gap-2 text-xs mb-2.5"
    variants={featureItemVariants}
  >
    {icon}
    <span>{text}</span>
  </motion.div>
);

// Service Card component with enhanced design
const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  color,
  features,
  ctaText = "Pelajari Lebih Lanjut",
  technologies,
}) => {
  const colorStyles: ColorStyles = {
    teal: {
      bgGradient: "bg-gradient-to-br from-fuchsia-50 to-fuchsia-100",
      iconBg: "bg-fuchsia-600",
      borderColor: "border-fuchsia-200",
      textColor: "text-fuchsia-900",
      lightTextColor: "text-fuchsia-700",
      buttonBg: "bg-fuchsia-600 hover:bg-fuchsia-700",
      tagBg: "bg-fuchsia-600/10 text-fuchsia-700",
    },
    blue: {
      bgGradient: "bg-gradient-to-br from-sky-50 to-sky-100",
      iconBg: "bg-sky-600",
      borderColor: "border-sky-200",
      textColor: "text-sky-900",
      lightTextColor: "text-sky-700",
      buttonBg: "bg-sky-600 hover:bg-sky-700",
      tagBg: "bg-sky-600/10 text-sky-700",
    },
    purple: {
      bgGradient: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconBg: "bg-purple-600",
      borderColor: "border-purple-200",
      textColor: "text-purple-900",
      lightTextColor: "text-purple-700",
      buttonBg: "bg-purple-600 hover:bg-purple-700",
      tagBg: "bg-purple-600/10 text-purple-700",
    },
    orange: {
      bgGradient: "bg-gradient-to-br from-orange-50 to-orange-100",
      iconBg: "bg-orange-600",
      borderColor: "border-orange-200",
      textColor: "text-orange-900",
      lightTextColor: "text-orange-700",
      buttonBg: "bg-orange-600 hover:bg-orange-700",
      tagBg: "bg-orange-600/10 text-orange-700",
    },
    green: {
      bgGradient: "bg-gradient-to-br from-green-50 to-green-100",
      iconBg: "bg-green-600",
      borderColor: "border-green-200",
      textColor: "text-green-900",
      lightTextColor: "text-green-700",
      buttonBg: "bg-green-600 hover:bg-green-700",
      tagBg: "bg-green-600/10 text-green-700",
    },
  };

  const styles = colorStyles[color];

  return (
    <motion.div
      className={`rounded-xl border ${styles.borderColor} overflow-hidden h-full shadow-sm`}
      variants={cardVariants}
      whileHover="hover"
    >
      <div className={`h-full flex flex-col ${styles.bgGradient}`}>
        {/* Card Header with Icon and Title */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg ${styles.iconBg} text-white`}
            >
              {icon}
            </div>
            <div className="flex space-x-1">
              {technologies.slice(0, 2).map((tech, i) => (
                <span
                  key={i}
                  className={`text-xs px-1.5 py-0.5 rounded-md ${styles.tagBg}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <h3 className={`text-xl font-bold ${styles.textColor}`}>{title}</h3>
          <p className={`text-xs font-medium mb-2 ${styles.lightTextColor}`}>
            {subtitle}
          </p>
          <p className="text-gray-600 text-xs mb-3">{description}</p>
        </div>

        {/* Features List */}
        <div className="px-4 py-2 border-t border-b border-gray-100 bg-white/50">
          <h4 className={`text-sm font-semibold mb-2 ${styles.textColor}`}>
            Benefit Utama
          </h4>
          <div className="space-y-0.5">
            {features.slice(0, 3).map((feature, index) => (
              <FeatureItem
                key={index}
                icon={
                  <feature.icon
                    className={`w-4 h-4 ${styles.lightTextColor}`}
                  />
                }
                text={feature.text}
              />
            ))}
          </div>
        </div>

        {/* Card Footer with CTA */}
        <div className="p-4 pt-3 mt-auto">
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link href="/services">
              <Button
                className={`w-full ${styles.buttonBg} text-white text-sm`}
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const ServicesSection: React.FC = () => {
  // Service data
  const services: ServiceType[] = [
    {
      title: "Website",
      subtitle: "Website Modern & Responsif",
      description:
        "Web Personal atau Web Bisnis yang memerlukan alur kompleks? kami siap garapkan!",
      icon: <Globe size={20} />,
      color: "teal",
      technologies: ["Company", "Personal", "Startup"],
      features: [
        {
          icon: LayoutDashboard,
          text: "Desain responsif",
        },
        { icon: Rocket, text: "Performa optimal & SEO" },
        { icon: Database, text: "Integrasi Database" },
        { icon: Code, text: "Kode bersih dan mudah dipelihara" },
        { icon: Share2, text: "Integrasi media sosial" },
      ],
      ctaText: "Lihat Layanan Web",
    },
    {
      title: "Mobile App",
      subtitle: "Aplikasi iOS & Android",
      description:
        "Kami bantu aplikasi Kamu dari mulai perancangan hingga masuk ke Play Store & App Store",
      icon: <Smartphone size={20} />,
      color: "blue",
      technologies: ["Native", "Hybrid", "Lynx"],
      features: [
        { icon: Code, text: "Solusi native & cross-platform" },
        { icon: Share2, text: "Integrasi pihak ketiga" },
        { icon: MessagesSquare, text: "Fungsionalitas offline" },
        { icon: Sparkles, text: "Desain UI/UX yang menarik" },
        { icon: Rocket, text: "Aplikasi dengan performa tinggi" },
      ],
      ctaText: "Lihat Layanan Mobile",
    },
    {
      title: "AI & Automation",
      subtitle: "AI, Chatbot & Automations",
      description:
        "Efisiensi bisnis sangant penting! dengan teknologi AI, berbagai alur pekerjaan bisa otomatis",
      icon: <Bot size={20} />,
      color: "purple",
      technologies: ["n8n", "OpenAI", "TensorFlow"],
      features: [
        { icon: Zap, text: "Chatbot AI asisten" },
        { icon: Rocket, text: "Otomasi laporan bisnis" },
        { icon: Code, text: "Custom AI integration" },
        { icon: Target, text: "Machine learning solutions" },
        { icon: Sparkles, text: "Natural language processing" },
      ],
      ctaText: "Lihat Layanan AI",
    },
    {
      title: "Digital Ads",
      subtitle: "Pemasaran Digital & Branding",
      description:
        "Strategi pemasaran untuk meningkatkan brand awareness & menghasilkan qualified leads",
      icon: <Megaphone size={20} />,
      color: "orange",
      technologies: ["Google Ads", "Meta Ads", "Analytics"],
      features: [
        { icon: Target, text: "Targeted ad campaigns" },
        { icon: TrendingUp, text: "Brand awareness strategy" },
        { icon: Users, text: "Social media management" },
        { icon: Sparkles, text: "Creative content development" },
        { icon: Share2, text: "Multi-platform campaigns" },
      ],
      ctaText: "Lihat Digital Ads",
    },
    {
      title: "E-Commerce",
      subtitle: "Toko Online & Marketplace",
      description:
        "Pasarkan produk kamu secara independen agar membangun kepercayaan konsumen",
      icon: <ShoppingCart size={20} />,
      color: "green",
      technologies: ["Shopify", "WooCommerce", "Custom"],
      features: [
        { icon: Package, text: "Product management system" },
        { icon: CreditCard, text: "Payment gateway integration" },
        { icon: TrendingUp, text: "Sales analytics & reporting" },
        { icon: Users, text: "Customer management" },
        { icon: Rocket, text: "Mobile-optimized checkout" },
      ],
      ctaText: "Lihat E-Commerce",
    },
  ];

  return (
    <motion.section
      className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Additional CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 mb-4">
            Butuh solusi khusus? Kami siap membantu.
          </p>
          <Link href="/services">
            <Button variant="outline" className="border-gray-300 text-gray-700">
              Lihat Semua Layanan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;
