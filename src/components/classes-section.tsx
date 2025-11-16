"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/../convex/_generated/api";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const ClassesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );

  // Get categories for badges
  const categories = useQuery(api.classes.getPublishedClassCategories);
  const categoriesList = categories ?? [];

  // Get classes based on selected category
  const classes = useQuery(
    api.classes.getPublishedClassesPublic,
    selectedCategory !== undefined
      ? { category: selectedCategory, limit: 2 }
      : { limit: 2 }
  );
  const classesList = classes ?? [];

  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency === "IDR" ? "IDR" : "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get first class for display (left card)
  const firstClass = classesList[0];
  // Get second class for display (right card) or use first if only one exists
  const secondClass = classesList[1] || classesList[0];

  return (
    <section className="pb-16 pt-8 md:pt-8 md:pb-24 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header Section */}
        {/* <div className="text-center mb-12">
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">
            Kelas
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
            Pilih Kelas yang Tepat untuk Perkembangan Kamu
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Temukan berbagai kelas berkualitas tinggi yang dirancang khusus
            untuk membantu kamu mengembangkan skill dan mencapai tujuan
            profesionalmu dengan bimbingan expert berpengalaman.
          </p>
        </div> */}

        {/* Category Badges */}
        {categoriesList.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categoriesList.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Classes Cards - 5:7 Ratio */}
        {classesList.length > 0 && firstClass ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Card (5 columns) - Title, Description */}
            <motion.div
              className="md:col-span-5 bg-gray-50 rounded-3xl border-none overflow-hidden "
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-4 uppercase tracking-wide">
                    Untuk {firstClass.category}
                  </p>
                  <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-12">
                    {firstClass.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed line-clamp-2">
                    {firstClass.description}
                  </p>
                </div>
                {/* Price - keep pinned at bottom */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="text-xl font-semibold text-gray-900">
                    {formatPrice(firstClass.price, firstClass.currency)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Card (7 columns) - Expert Image and Name */}
            <motion.div
              className="md:col-span-7 bg-gray-50 rounded-3xl border-none overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative h-full min-h-[400px] md:min-h-[450px]">
                {secondClass?.expert?.profileImage ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={secondClass.expert.profileImage}
                        alt={secondClass.expert.name || "Expert"}
                        width={600}
                        height={600}
                        className="object-contain max-w-full max-h-full"
                        priority
                      />
                    </div>
                    {/* Decorative text overlay (like "Save 6+" in the image) */}
                    <div className="absolute top-12 right-12 z-0">
                      <p className="text-7xl md:text-8xl font-bold text-gray-200/40 select-none pointer-events-none">
                        {formatPrice(secondClass.price, secondClass.currency)
                          .replace(/[^0-9]/g, "")
                          .slice(0, 2)}
                        +
                      </p>
                    </div>
                    {/* Expert info overlay */}
                    <div className="absolute bottom-8 left-8 right-8 z-10">
                      <p className="text-sm text-gray-600 mb-2 font-medium">
                        Dengan Expert
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {secondClass.expert.name}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                    {/* Decorative text */}
                    <div className="absolute top-12 right-12 z-0">
                      <p className="text-7xl md:text-8xl font-bold text-white/20 select-none pointer-events-none">
                        {formatPrice(
                          secondClass?.price || 0,
                          secondClass?.currency || "IDR"
                        )
                          .replace(/[^0-9]/g, "")
                          .slice(0, 2)}
                        +
                      </p>
                    </div>
                    <div className="text-center text-white z-10">
                      <p className="text-sm mb-2 font-medium">Dengan Expert</p>
                      <p className="text-2xl md:text-3xl font-bold">
                        {secondClass?.expert?.name || "Expert"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ) : classes === undefined ? (
          // Loading state with skeleton
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Card Skeleton (5 columns) */}
            <div className="md:col-span-5 bg-white rounded-xl border border-gray-200 p-8">
              <Skeleton className="h-3 w-20 mb-4" />
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-6" />
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            {/* Right Card Skeleton (7 columns) */}
            <div className="md:col-span-7 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <Skeleton className="h-full min-h-[400px] md:min-h-[450px] bg-gray-100" />
            </div>
          </div>
        ) : (
          // Empty state
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada kelas yang tersedia.</p>
          </div>
        )}

        {/* Navigation Button */}
        <div className="flex justify-center mt-10">
          <Link href="/exclusive-class">
            <motion.button
              className="px-8 py-3 cursor-pointer bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition-colors shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Lihat Semua Kelas
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ClassesSection;
