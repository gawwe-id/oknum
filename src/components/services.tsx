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

type ColorType = "teal" | "blue";

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
    className="flex items-center gap-2 text-sm mb-2.5"
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
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-lg ${styles.iconBg} text-white`}
            >
              {icon}
            </div>
            <div className="flex space-x-1">
              {technologies.map((tech, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded-full ${styles.tagBg}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <h3 className={`text-2xl font-bold mb-1 ${styles.textColor}`}>
            {title}
          </h3>
          <p className={`text-sm font-medium mb-3 ${styles.lightTextColor}`}>
            {subtitle}
          </p>
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        </div>

        {/* Features List */}
        <div className="px-6 py-3 border-t border-b border-gray-100 bg-white/50">
          <h4 className={`text-sm font-semibold mb-3 ${styles.textColor}`}>
            Fitur Utama
          </h4>
          <div className="space-y-0.5">
            {features.map((feature, index) => (
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
        <div className="p-6 pt-4 mt-auto">
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link href="/services">
              <Button className={`w-full ${styles.buttonBg} text-white`}>
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
      title: "Web Development",
      subtitle: "Website Modern & Responsif",
      description:
        "Kami membuat website dengan performa tinggi dan pengalaman pengguna yang intuitif untuk meningkatkan engagement dan konversi bisnis Anda.",
      icon: <Globe size={24} />,
      color: "teal",
      technologies: ["Typescript", "HTML", "CSS"],
      features: [
        {
          icon: LayoutDashboard,
          text: "Desain responsif untuk semua perangkat",
        },
        { icon: Rocket, text: "Dioptimalkan untuk performa & SEO" },
        { icon: Sparkles, text: "Antarmuka pengguna yang intuitif" },
        { icon: Code, text: "Kode bersih dan mudah dipelihara" },
        { icon: Share2, text: "Integrasi media sosial" },
      ],
      ctaText: "Lihat Layanan Web",
    },
    {
      title: "Mobile Development",
      subtitle: "Aplikasi iOS & Android",
      description:
        "Kami membangun aplikasi mobile native dan cross-platform yang memberikan pengalaman pengguna luar biasa di semua perangkat.",
      icon: <Smartphone size={24} />,
      color: "blue",
      technologies: ["React Native", "Flutter", "Lynx"],
      features: [
        { icon: Code, text: "Solusi native & cross-platform" },
        { icon: Sparkles, text: "Desain UI/UX yang menarik" },
        { icon: Rocket, text: "Aplikasi dengan performa tinggi" },
        { icon: MessagesSquare, text: "Fungsionalitas offline" },
        { icon: Share2, text: "Integrasi API pihak ketiga" },
      ],
      ctaText: "Lihat Layanan Mobile",
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
      <div className="container mx-auto max-w-5xl px-4">
        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
