"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-fuchsia-600 to-purple-600">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tidak yakin layanan mana yang tepat?
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Konsultasi gratis untuk bahas kebutuhan bisnis Anda
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-fuchsia-600 hover:bg-gray-100"
            >
              Konsultasi Gratis Sekarang
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
