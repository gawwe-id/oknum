"use client";

import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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

const ContactTitle = () => {
  return (
    <motion.div className="text-center mb-12" variants={itemVariants}>
      <motion.span
        className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm font-medium mb-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        Hubungi Kami
      </motion.span>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Butuh Bantuan? Kami Siap Membantu
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Silahkan hubungi kami untuk pertanyaan, konsultasi, atau informasi lebih
        lanjut tentang layanan yang kami tawarkan.
      </p>
    </motion.div>
  );
};

export default ContactTitle;
