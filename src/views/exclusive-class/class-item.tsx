'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Layers, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type ClassItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  duration: number;
  thumbnail?: string;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  createdAt: number;
  expert?: {
    name: string;
    profileImage?: string;
  } | null;
};

interface ClassItemProps {
  classItem: ClassItem;
  getLessonsCount: (classItem: ClassItem) => number;
  formatDuration: (minutes: number) => string;
}

export default function ClassItem({
  classItem,
  getLessonsCount,
  formatDuration
}: ClassItemProps) {
  const isNew = Date.now() - classItem.createdAt < 7 * 24 * 60 * 60 * 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <Link href={`/exclusive-class/${classItem._id}`}>
        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
          {classItem.thumbnail ? (
            <Image
              src={classItem.thumbnail}
              alt={classItem.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-emerald-100 to-emerald-200">
              <Layers className="size-12 text-emerald-400" />
            </div>
          )}
          {/* New Badge - show for recently created classes (within 7 days) */}
          {isNew && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-emerald-500 text-white border-none">
                New
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2">
            <Badge
              variant="outline"
              className="text-xs border-emerald-200 text-emerald-700 bg-emerald-50"
            >
              {classItem.category}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {classItem.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
            <div className="flex items-center gap-1">
              <Layers className="size-4" />
              <span>{getLessonsCount(classItem)} Lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>{formatDuration(classItem.duration)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
