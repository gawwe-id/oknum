"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Star, Users, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Id } from "../../convex/_generated/dataModel";

export type Expert = {
  _id: Id<"experts">;
  name: string;
  email: string;
  slug: string;
  bio: string;
  profileImage?: string;
  specialization: string[];
  experience: string;
  rating?: number;
  totalStudents?: number;
  status: "active" | "inactive";
  createdAt: number;
  updatedAt: number;
};

interface ExpertCardProps {
  expert: Expert;
}

export default function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      <Link href={`/our-experts/${expert.slug}`}>
        <div className="p-6">
          {/* Profile Image */}
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              {expert.profileImage ? (
                <Image
                  src={expert.profileImage}
                  alt={expert.name}
                  fill
                  className="object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-emerald-600" />
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2 group-hover:text-emerald-600 transition-colors">
            {expert.name}
          </h3>

          {/* Bio */}
          <p className="text-sm text-gray-600 text-center mb-4 line-clamp-3">
            {expert.bio}
          </p>

          {/* Specializations */}
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {expert.specialization.slice(0, 3).map((spec, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50"
              >
                {spec}
              </Badge>
            ))}
            {expert.specialization.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs border-gray-200 text-gray-600 bg-gray-50"
              >
                +{expert.specialization.length - 3} more
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            {expert.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{expert.rating.toFixed(1)}</span>
              </div>
            )}
            {expert.totalStudents && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{expert.totalStudents}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{expert.experience}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
