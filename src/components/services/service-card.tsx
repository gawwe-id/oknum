"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Service, colorClasses } from "./types";

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = React.memo(({ service }: ServiceCardProps) => {
  const styles = colorClasses[service.color];
  return (
    <motion.div
      className={`overflow-hidden h-full w-full max-w-full`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={`h-full flex flex-col`}>
        <div className="p-4 sm:p-6">
          <div className="relative w-full h-48 mb-4">
            <Image
              src={service.illustration}
              alt={service.title}
              fill
              className="object-contain"
            />
          </div>
          <div className="mb-4">
            <div className="flex flex-wrap justify-center gap-2">
              {service.technologies.map((tech, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-1 rounded-md ${styles.tagBg}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = "ServiceCard";
