"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Service, colorClasses } from "./types";

interface ContentSectionProps {
  service: Service;
}

export const ContentSection = React.memo(({ service }: ContentSectionProps) => {
  const styles = colorClasses[service.color];
  return (
    <motion.div
      className="flex flex-col justify-center w-full max-w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {service.title}
      </h2>
      <p className="text-lg text-gray-600 mb-6">{service.description}</p>

      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Yang Anda Dapatkan:
      </h3>
      <ul className="space-y-3 mb-6">
        {service.includes.map((item, i) => (
          <motion.li
            key={i}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{
              duration: 0.4,
              delay: 0.4 + i * 0.05,
              ease: "easeOut",
            }}
          >
            <Check
              className={`w-5 h-5 ${styles.lightTextColor} flex-shrink-0 mt-0.5`}
            />
            <span className="text-gray-700">{item}</span>
          </motion.li>
        ))}
      </ul>

      <Link href="/contact">
        <Button
          size="lg"
          className={`${styles.iconBg} hover:opacity-90 text-white`}
        >
          Konsultasi Sekarang
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
});

ContentSection.displayName = "ContentSection";
