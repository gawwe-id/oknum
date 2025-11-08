"use client";

import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const ContactMap = () => {
  return (
    <motion.div
      className="mt-12 rounded-xl overflow-hidden shadow-sm border border-gray-100"
      variants={itemVariants}
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2954924568!2d106.68270661537746!3d-6.222738662711481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f9912c7f297b%3A0x6dcc7fa3a4058e25!2sTangerang%20Selatan%2C%20South%20Tangerang%20City%2C%20Banten!5e0!3m2!1sen!2sid!4v1651234567890!5m2!1sen!2sid"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Lokasi Kantor Oknum"
        className="w-full"
      ></iframe>
    </motion.div>
  );
};

export default ContactMap;
