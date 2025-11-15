'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ClassFeatureLeftProps {
  badge?: string;
  title: string;
  description: string;
  illustrationPath?: string; // Path to SVG illustration from undraw
}

const ClassFeatureLeft: React.FC<ClassFeatureLeftProps> = ({
  badge = 'Feature',
  title,
  description,
  illustrationPath = '/illustrations/mentoring.svg' // Placeholder until real SVG is added
}) => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Illustration */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
              {illustrationPath ? (
                <Image
                  src={illustrationPath}
                  alt={title}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-2">
                      Illustration Placeholder
                    </p>
                    <p className="text-gray-300 text-xs">
                      Add SVG from undraw.co
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              <motion.span
                className="inline-block px-3 py-1 bg-teal-100 text-teal-600 rounded-full text-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {badge}
              </motion.span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {title}
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                {description}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClassFeatureLeft;
