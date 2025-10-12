"use client";

import React from "react";
import { motion } from "framer-motion";

export const HeroService = () => {
  return (
    <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Layanan Kami
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Solusi digital yang praktis dan terukur untuk UMKM. <br />
            Kami fokus pada hasil, bukan janji.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
