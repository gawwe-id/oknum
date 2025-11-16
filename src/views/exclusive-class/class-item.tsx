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
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {classItem.description}
          </p>
          
          {/* Price */}
          <div className="mb-3">
            <span className="text-2xl font-bold text-emerald-600">
              {classItem.currency === 'IDR' ? 'Rp' : classItem.currency} {classItem.price.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Expert Info */}
          {classItem.expert && (
            <div className="flex items-center gap-2 mb-3">
              {classItem.expert.profileImage ? (
                <Image
                  src={classItem.expert.profileImage}
                  alt={classItem.expert.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              ) : (
                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-xs text-emerald-600 font-semibold">
                    {classItem.expert.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm text-gray-700 font-medium">{classItem.expert.name}</span>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600">
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
