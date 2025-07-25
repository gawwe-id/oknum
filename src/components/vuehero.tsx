"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
// import Link from "next/link";

export default function Hero() {
  const redirectToWhatsApp = () => {
    // Replace with your actual WhatsApp number (international format without +)
    const phoneNumber = "6281218227597";
    const message = encodeURIComponent(
      "Halo, saya ingin bertanya tentang layanan Oknum."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <section className="pt-16 pb-8 md:pt-20 md:pb-12]">
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
                <span className="absolute inset-0 transform -skew-x-6 bg-teal-200 -z-10" />
                <span className="relative z-0 text-teal-600 px-4">
                  Tersangka
                </span>
              </span>{" "}
              Utama
            </span>
            <span className="text-gray-700 block relative z-0">
              Kejayaan Brand Kamu
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-3xl text-md text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Kami adalah <span className={`text-teal-600 font-bold`}>Oknum</span>
            , creator produk digital berkualitas dengan{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 transform -skew-x-6 bg-teal-600 -z-10" />
              <span className="relative z-0 text-white px-1">
                design yang intuitive
              </span>
            </span>{" "}
            dan performa optimal.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              className="bg-teal-600 hover:bg-teal-500 text-white px-6 gap-2"
              onClick={redirectToWhatsApp}
            >
              <svg
                fill="#fff"
                width="800px"
                height="800px"
                viewBox="-2 -2 24 24"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMinYMin"
                className="jam jam-whatsapp w-5 h-5"
              >
                <path d="M9.516.012C4.206.262.017 4.652.033 9.929a9.798 9.798 0 0 0 1.085 4.465L.06 19.495a.387.387 0 0 0 .47.453l5.034-1.184a9.981 9.981 0 0 0 4.284 1.032c5.427.083 9.951-4.195 10.12-9.58C20.15 4.441 15.351-.265 9.516.011zm6.007 15.367a7.784 7.784 0 0 1-5.52 2.27 7.77 7.77 0 0 1-3.474-.808l-.701-.347-3.087.726.65-3.131-.346-.672A7.62 7.62 0 0 1 2.197 9.9c0-2.07.812-4.017 2.286-5.48a7.85 7.85 0 0 1 5.52-2.271c2.086 0 4.046.806 5.52 2.27a7.672 7.672 0 0 1 2.287 5.48c0 2.052-.825 4.03-2.287 5.481z" />
                <path d="M14.842 12.045l-1.931-.55a.723.723 0 0 0-.713.186l-.472.478a.707.707 0 0 1-.765.16c-.913-.367-2.835-2.063-3.326-2.912a.694.694 0 0 1 .056-.774l.412-.53a.71.71 0 0 0 .089-.726L7.38 5.553a.723.723 0 0 0-1.125-.256c-.539.453-1.179 1.14-1.256 1.903-.137 1.343.443 3.036 2.637 5.07 2.535 2.349 4.566 2.66 5.887 2.341.75-.18 1.35-.903 1.727-1.494a.713.713 0 0 0-.408-1.072z" />
              </svg>
              WhatsApp
            </Button>

            {/* <Link href="/portofolio" passHref>
              <Button
                variant="outline"
                className="border-gray-300 text-teal-600 hover:text-teal-500 px-6 flex items-center gap-1"
              >
                Lihat hasil kerja kami
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1"
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </Link> */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
