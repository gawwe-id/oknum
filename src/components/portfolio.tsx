"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { StaticImageData } from "next/image";

// Import image
import panjiggm from "@/assets/images/portfolio/panjiggm.png";
import gawwe from "@/assets/images/portfolio/gawwe.png";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string | StaticImageData;
  category: string;
  tags: string[];
  demoUrl?: string;
}

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.5,
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

const tabsVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: 0.2,
    },
  },
};

const itemVariants = {
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
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const PortfolioCard: React.FC<{ item: PortfolioItem }> = ({ item }) => {
  const getImageSrc = () => {
    if (typeof item.imageUrl === "string") {
      return item.imageUrl;
    }
    return item.imageUrl.src;
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      layout
      className="h-full"
    >
      <Card className="overflow-hidden h-full border border-gray-200 bg-white">
        <div className="relative overflow-hidden aspect-video">
          <motion.img
            src={getImageSrc()}
            alt={item.title}
            className="object-cover w-full h-full"
            variants={imageVariants}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4"
            variants={overlayVariants}
            initial="hidden"
            whileHover="hover"
          >
            <div className="w-full">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {item.demoUrl && (
                    <motion.a
                      href={item.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/90 p-2 rounded-full text-gray-800 hover:bg-white"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink size={16} />
                    </motion.a>
                  )}
                </div>
                <motion.span
                  className="text-white text-xs px-2 py-1 rounded-full bg-blue-500/80"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.category}
                </motion.span>
              </div>
            </div>
          </motion.div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
            <motion.div
              initial={{ opacity: 0, rotate: -45 }}
              whileHover={{ opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowUpRight className="h-4 w-4 text-blue-500" />
            </motion.div>
          </div>
          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag, index) => (
              <motion.span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                whileHover={{ backgroundColor: "#e5e7eb", scale: 1.05 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const portfolioData: PortfolioItem[] = [
  {
    id: "1",
    title: "Panji Gumelar",
    description:
      "Website Portofolio pribadi yang menampilkan karya dan pengalaman di bidang teknologi.",
    imageUrl: panjiggm,
    category: "Web",
    tags: ["NextJS", "TypeScript", "Tailwind CSS", "Shadcn Ui"],
    demoUrl: "https://panjiggm.me",
  },
  {
    id: "2",
    title: "Gawwe Indonesia",
    description:
      "Platform untuk memudahkan pengguna dalam menemukan agensi pelatihan kerja & bahasa.",
    imageUrl: gawwe,
    category: "Web",
    tags: ["NextJS", "TypeScript", "Material UI", "Joy UI"],
    demoUrl: "https://panjiggm.me",
  },
];

const PortfolioSection: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");

  const categories = [
    "all",
    ...Array.from(new Set(portfolioData.map((item) => item.category))),
  ];

  const filteredItems =
    filter === "all"
      ? portfolioData
      : portfolioData.filter((item) => item.category === filter);

  return (
    <motion.section
      className="py-16 md:py-24"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div className="text-center mb-12" variants={headingVariants}>
          <motion.span
            className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-medium mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            Portfolio
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Karya Terbaik Kami
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Berikut adalah beberapa proyek yang telah kami kerjakan. Setiap
            proyek dirancang dengan perhatian penuh terhadap detail dan
            kebutuhan klien.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-8"
          variants={tabsVariants}
        >
          <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
            <TabsList className="bg-gray-100 p-1">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category === "all" ? "Semua" : category}
                  </motion.span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium inline-flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Lihat Semua Projek</span>
            <ArrowUpRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PortfolioSection;
