'use client';

import { motion } from 'framer-motion';

export default function ExclusiveClassHero() {
  return (
    <section className="pt-16 pb-8 md:pt-20 md:pb-12">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="font-rubik text-5xl md:text-6xl lg:text-7xl font-black tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-gray-700 block relative z-0">
              <span className="relative inline-block">
                <span className="absolute inset-0 transform -skew-x-6 bg-emerald-200 -z-10" />
                <span className="relative z-0 text-emerald-600 px-4">
                  Kelas
                </span>
              </span>{' '}
              Eksklusif &
            </span>
            <span className="text-gray-700 block relative z-0">
              Premium Experiences
            </span>
          </motion.h1>
        </motion.div>
      </div>
    </section>
  );
}
