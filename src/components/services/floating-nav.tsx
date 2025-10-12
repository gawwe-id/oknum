"use client";

import React from "react";
import { motion } from "framer-motion";

interface FloatingNavProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

export const FloatingNav = ({
  activeSection,
  scrollToSection,
}: FloatingNavProps) => {
  const menuItems = [
    {
      id: "web-mobile",
      title: "Web & Mobile",
      icon: "🌐",
      color: "fuchsia",
    },
    {
      id: "ai-automation",
      title: "AI & Automation",
      icon: "🤖",
      color: "sky",
    },
    {
      id: "digital-ads",
      title: "Digital Ads",
      icon: "📢",
      color: "orange",
    },
    {
      id: "ecommerce",
      title: "E-Commerce",
      icon: "🛒",
      color: "green",
    },
  ];

  const getActiveStyles = (color: string) => {
    const colorMap: Record<string, string> = {
      fuchsia: "bg-fuchsia-50 text-fuchsia-700",
      sky: "bg-sky-50 text-sky-700",
      orange: "bg-orange-50 text-orange-700",
      green: "bg-green-50 text-green-700",
    };
    return colorMap[color] || "bg-gray-50 text-gray-700";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="mb-3 px-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Services
          </h3>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                activeSection === item.id
                  ? `${getActiveStyles(item.color)} font-medium`
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};
