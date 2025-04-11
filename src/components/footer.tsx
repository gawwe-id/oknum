"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ArrowUp,
  Send,
} from "lucide-react";
import { reggae } from "@/app/fonts";
import Link from "next/link";

// Animation variants
const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

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

const linkVariants = {
  hover: {
    x: 5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
    },
  },
};

// Footer component
const Footer: React.FC = () => {
  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="border-b border-gray-800">
        <motion.div
          className="container mx-auto max-w-6xl px-4 py-12 md:py-16"
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <motion.div variants={itemVariants}>
              <div className="mb-6">
                <h2
                  className={`text-2xl font-bold text-white mb-2 ${reggae.className}`}
                >
                  Oknum
                </h2>
                <div className="w-12 h-1 bg-emerald-600 rounded-full mb-4"></div>
                <p className="mb-4 text-gray-400">
                  Kami membantu bisnis Kamu tumbuh dengan solusi digital yang
                  inovatif dan berkualitas tinggi.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <p className="text-gray-400">Tangerang Selatan, Indonesia</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <p className="text-gray-400">+62 123 4567 890</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  <p className="text-gray-400">info@oknum.id</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold text-white mb-4">Navigasi</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" passHref>
                    <motion.span
                      className="text-gray-400 hover:text-emerald-600 transition-colors inline-block cursor-pointer"
                      variants={linkVariants}
                      whileHover="hover"
                    >
                      Tentang Kami
                    </motion.span>
                  </Link>
                </li>
                <li>
                  <Link href="/#services" passHref>
                    <motion.span
                      className="text-gray-400 hover:text-emerald-600 transition-colors inline-block cursor-pointer"
                      variants={linkVariants}
                      whileHover="hover"
                    >
                      Layanan
                    </motion.span>
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" passHref>
                    <motion.span
                      className="text-gray-400 hover:text-emerald-600 transition-colors inline-block cursor-pointer"
                      variants={linkVariants}
                      whileHover="hover"
                    >
                      Portfolio
                    </motion.span>
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" passHref>
                    <motion.span
                      className="text-gray-400 hover:text-emerald-600 transition-colors inline-block cursor-pointer"
                      variants={linkVariants}
                      whileHover="hover"
                    >
                      Pricing
                    </motion.span>
                  </Link>
                </li>
                <li>
                  <Link href="/faq" passHref>
                    <motion.span
                      className="text-gray-400 hover:text-emerald-600 transition-colors inline-block cursor-pointer"
                      variants={linkVariants}
                      whileHover="hover"
                    >
                      FAQ
                    </motion.span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" passHref>
                    <motion.span
                      className="text-gray-400 hover:text-emerald-600 transition-colors inline-block cursor-pointer"
                      variants={linkVariants}
                      whileHover="hover"
                    >
                      Kontak
                    </motion.span>
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Legal Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" passHref>
                    <motion.span
                      className="text-gray-400 hover:text-emerald-600 transition-colors inline-block cursor-pointer"
                      variants={linkVariants}
                      whileHover="hover"
                    >
                      Privacy Policy
                    </motion.span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms-conditions" passHref>
                    <motion.span
                      className="text-gray-400 hover:text-emerald-600 transition-colors inline-block cursor-pointer"
                      variants={linkVariants}
                      whileHover="hover"
                    >
                      Terms & Conditions
                    </motion.span>
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" passHref>
                    <motion.span
                      className="text-gray-400 hover:text-emerald-600 transition-colors inline-block cursor-pointer"
                      variants={linkVariants}
                      whileHover="hover"
                    >
                      Refund Policy
                    </motion.span>
                  </Link>
                </li>
              </ul>

              <h3 className="text-lg font-bold text-white mt-6 mb-4">
                Jam Operasional
              </h3>
              <p className="text-gray-400">Senin - Jumat: 09:00 - 17:00</p>
              <p className="text-gray-400">Sabtu - Minggu: Tutup</p>
            </motion.div>

            {/* Newsletter */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold text-white mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Dapatkan update terbaru tentang layanan dan promo spesial kami.
              </p>
              <div className="flex mb-4">
                <input
                  type="email"
                  placeholder="Email Kamu"
                  className="flex-grow px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <motion.button
                  className="px-4 py-2 bg-emerald-600 rounded-r-md text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>

              <h3 className="text-lg font-bold text-white mt-6 mb-4">
                Social Media
              </h3>
              <div className="flex space-x-4">
                <motion.a
                  href="#facebook"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-emerald-600"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#4267B2",
                    color: "#ffffff",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Facebook className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#instagram"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-emerald-600"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#E1306C",
                    color: "#ffffff",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#twitter"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-emerald-600"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#1DA1F2",
                    color: "#ffffff",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#linkedin"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-emerald-600"
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#0A66C2",
                    color: "#ffffff",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Oknum. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-500">
            <a
              href="#privacy"
              className="hover:text-emerald-600 transition-colors"
            >
              Privacy
            </a>
            <span>|</span>
            <a
              href="#terms"
              className="hover:text-emerald-600 transition-colors"
            >
              Terms
            </a>
            <span>|</span>
            <a
              href="#sitemap"
              className="hover:text-emerald-600 transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <motion.button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg z-50"
        onClick={scrollToTop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp />
      </motion.button>
    </footer>
  );
};

export default Footer;
