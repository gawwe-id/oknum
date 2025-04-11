"use client";

import { motion } from "framer-motion";

import ContactTitle from "@/views/contact/contact-title";
import ContactForms from "@/views/contact/contact-forms";
import ContactMap from "@/views/contact/contact-map";

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
};

const Contact = () => {
  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-12 md:py-20"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Page Header */}
        <ContactTitle />
        <ContactForms />

        {/* Google Maps Embed (Optional) */}
        <ContactMap />
      </div>
    </motion.div>
  );
};

export default Contact;
