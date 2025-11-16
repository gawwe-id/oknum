"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { Button } from "@/components/ui/button";
import { Layers, ChevronDown, ChevronUp } from "lucide-react";

interface ClassDetailHeroProps {
  classId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  thumbnail?: string;
  status: "draft" | "published" | "completed" | "cancelled";
}

export default function ClassDetailHero({
  classId,
  title,
  description,
  price,
  currency,
  thumbnail,
  status,
}: ClassDetailHeroProps) {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);
  const [needsTruncate, setNeedsTruncate] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const measureRef = useRef<HTMLParagraphElement>(null);

  // Check if description needs truncation
  useEffect(() => {
    if (measureRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(measureRef.current).lineHeight
      );
      const maxHeight = lineHeight * 7; // 7 lines
      const actualHeight = measureRef.current.scrollHeight;
      setNeedsTruncate(actualHeight > maxHeight);
    }
  }, [description]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency === "IDR" ? "IDR" : "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleEnroll = () => {
    router.push(`/exclusive-class/${classId}/checkout`);
  };

  return (
    <section className="pt-8 pb-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Thumbnail */}
          <motion.div
            className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-emerald-100 to-emerald-200">
                <Layers className="size-16 text-emerald-400" />
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>

            {/* Description */}
            <div className="space-y-2 relative">
              {/* Hidden element to measure full height */}
              <p
                ref={measureRef}
                className="text-lg text-gray-600 leading-relaxed whitespace-pre-line invisible absolute top-0 left-0 w-full"
                aria-hidden="true"
              >
                {description}
              </p>
              {/* Visible description */}
              <p
                ref={descriptionRef}
                className={`text-lg text-gray-600 leading-relaxed whitespace-pre-line transition-all ${
                  !showMore && needsTruncate ? "line-clamp-3" : ""
                }`}
              >
                {description}
              </p>
              {needsTruncate && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowMore(!showMore)}
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 -ml-2"
                >
                  {showMore ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show More
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-600">
                {formatPrice(price, currency)}
              </span>
            </div>

            {/* CTA Button */}
            {status === "published" && (
              <div className="pt-4">
                <ButtonPrimary
                  size="lg"
                  className="w-full md:w-auto"
                  onClick={handleEnroll}
                >
                  Daftar Sekarang
                </ButtonPrimary>
              </div>
            )}

            {status !== "published" && (
              <div className="pt-4">
                <Badge
                  variant="outline"
                  className="text-sm bg-gray-100 text-gray-600"
                >
                  {status === "draft"
                    ? "Segera Hadir"
                    : status === "completed"
                    ? "Kelas Selesai"
                    : "Kelas Dibatalkan"}
                </Badge>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
