"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface ClientsProps {
  title?: string;
  subtitle?: string;
}

// Data client (placeholder)
const clientsData = [
  { id: 1, name: "Microsoft" },
  { id: 2, name: "Google" },
  { id: 3, name: "Amazon" },
  { id: 4, name: "Netflix" },
  { id: 5, name: "Tesla" },
  { id: 6, name: "Spotify" },
  { id: 7, name: "Airbnb" },
  { id: 8, name: "Adobe" },
  { id: 9, name: "Twitter" },
  { id: 10, name: "Instagram" },
  { id: 11, name: "Uber" },
  { id: 12, name: "Slack" },
];

// Membuat array duplikat untuk efek scroll tak terbatas
const duplicatedClients = [...clientsData, ...clientsData];

const Clients: React.FC<ClientsProps> = ({
  title = "Klien Kami",
  subtitle = "Kami telah bekerja sama dengan berbagai perusahaan terkemuka di industri",
}) => {
  const marqueeControls = useAnimation();

  useEffect(() => {
    const duration = clientsData.length * 5;

    // Animasi marquee
    marqueeControls.start({
      x: [0, -2000],
      transition: {
        duration: duration,
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [marqueeControls]);

  return (
    <motion.section
      className="py-16 md:py-20 bg-[#FEF9E1] overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto max-w-6xl px-4 mb-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Dipercaya
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>
      </div>

      <div className="relative max-w-6xl mx-auto overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-[#FEF9E1] to-transparent pointer-events-none"></div>

        <motion.div
          className="flex items-center py-6 whitespace-nowrap"
          animate={marqueeControls}
        >
          {duplicatedClients.map((client, index) => (
            <motion.div
              key={`${client.id}-${index}`}
              className="mx-8 flex items-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="bg-gray-50 border border-gray-100 rounded-lg px-8 py-6 min-w-[180px] h-20 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <span className="text-xl font-bold text-gray-700">
                  {client.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-[#FEF9E1] to-transparent pointer-events-none"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 mt-10">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 bg-purple-50 rounded-2xl border-purple-600 border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl md:text-2xl font-bold text-purple-800 mb-2">
              Siap untuk bekerja sama dengan kami?
            </h3>
            <p className="text-purple-700 opacity-80">
              Mari diskusikan bagaimana kami dapat membantu proyek Kamu
              berikutnya
            </p>
          </div>
          <motion.button
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hubungi Kami
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export { Clients as default };
