"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
}

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
    y: -8,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      delay: 0.2,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
    },
  },
};

const linkIconVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 0 },
  hover: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  subtitle,
  icon,
  bgColor,
  textColor,
  borderColor,
}) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Card
        className={`group relative overflow-hidden transition-all duration-300 h-full rounded-xl ${bgColor} shadow-none ${borderColor}`}
      >
        <motion.div
          className="absolute inset-0 bg-white/5"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.2 }}
          transition={{ duration: 0.3 }}
        ></motion.div>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col h-full">
            <motion.div className="mb-4 relative z-10" variants={iconVariants}>
              {icon}
            </motion.div>
            <div className="mb-2 flex justify-between items-start">
              <h3 className={`text-xl md:text-2xl font-bold ${textColor}`}>
                {title}
              </h3>
              <motion.div variants={linkIconVariants}>
                <ExternalLink className={`${textColor} h-5 w-5`} />
              </motion.div>
            </div>
            <motion.p
              className={`text-sm opacity-80 ${textColor}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const WebsiteIcon: React.FC = () => (
  <motion.svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ rotate: -5 }}
    animate={{ rotate: 0 }}
    transition={{ type: "spring", stiffness: 100 }}
  >
    <circle cx="40" cy="40" r="36" fill="#FF6B6B" />
    <path
      d="M28 30c0-5.5 4.5-10 10-10s10 4.5 10 10c0 3.5-2.5 7.5-5.5 12-1.5 2.25-3 4.25-4.5 6-1.5-1.75-3-3.75-4.5-6-3-4.5-5.5-8.5-5.5-12z"
      fill="#FFE0DD"
      stroke="#FF3333"
      strokeWidth="2"
    />
    <circle cx="38" cy="30" r="4" fill="#FF3333" />
    <path
      d="M48 50c0 5.5-4.5 10-10 10s-10-4.5-10-10"
      stroke="#FF3333"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </motion.svg>
);

const MobileIcon: React.FC = () => (
  <motion.svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ rotate: 5 }}
    animate={{ rotate: 0 }}
    transition={{ type: "spring", stiffness: 100 }}
  >
    <circle cx="40" cy="40" r="36" fill="#4E9EFD" />
    <path
      d="M40 20c-8 0-16 8-16 16s8 16 16 16 16-8 16-16-8-16-16-16z"
      fill="#D1EBFF"
      stroke="#2B78E4"
      strokeWidth="2"
    />
    <path
      d="M52 44c-8 8-16 8-24 0"
      stroke="#2B78E4"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="35" cy="36" r="3" fill="#2B78E4" />
    <circle cx="45" cy="36" r="3" fill="#2B78E4" />
    <path
      d="M28 52l4-4M52 52l-4-4"
      stroke="#2B78E4"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </motion.svg>
);

const ServicesSection: React.FC = () => {
  return (
    <motion.section
      className="py-12 md:py-20"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto max-w-3xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Website Service Card */}
          <ServiceCard
            title="Website"
            subtitle="Website profesional dengan desain dan fungsionalitas modern."
            icon={<WebsiteIcon />}
            bgColor="bg-rose-50"
            textColor="text-rose-600"
            accentColor="text-rose-500"
            borderColor="border-rose-300"
          />

          {/* Mobile Apps Service Card */}
          <ServiceCard
            title="Mobile Apps"
            subtitle="Aplikasi mobile native dan cross-platform untuk iOS dan Android."
            icon={<MobileIcon />}
            bgColor="bg-green-50"
            textColor="text-sky-600"
            accentColor="text-sky-500"
            borderColor="border-sky-300"
          />
        </div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;
