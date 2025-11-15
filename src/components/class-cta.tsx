'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ClassCTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

const ClassCTA: React.FC<ClassCTAProps> = ({
  title = 'Siap Memulai Perjalanan Belajarmu?',
  description = 'Bergabunglah dengan kelas eksklusif kami dan dapatkan pengalaman belajar yang tak terlupakan bersama expert berpengalaman.',
  primaryButtonText = 'Lihat Semua Kelas',
  primaryButtonLink = '/exclusive-class',
  secondaryButtonText,
  secondaryButtonLink
}) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto max-w-4xl px-4 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-teal-50 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {description}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href={primaryButtonLink}>
              <motion.button
                className="px-8 py-4 bg-white text-teal-700 rounded-full font-semibold hover:bg-teal-50 transition-colors shadow-lg inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{primaryButtonText}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            {secondaryButtonText && secondaryButtonLink && (
              <Link href={secondaryButtonLink}>
                <motion.button
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{secondaryButtonText}</span>
                </motion.button>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClassCTA;

