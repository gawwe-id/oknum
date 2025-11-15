'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from 'convex-helpers/react/cache';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ClassDetail from '@/views/exclusive-class/class-detail';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.classId as Id<'classes'>;

  const classData = useQuery(api.classes.getClassByIdPublic, { classId });

  // Loading state
  if (classData === undefined) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="space-y-8">
            {/* Back button skeleton */}
            <Skeleton className="h-10 w-24" />

            {/* Hero skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* Content skeleton */}
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!classData) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="space-y-6">
            <Link href="/exclusive-class">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="size-4" />
                Kembali ke Daftar Kelas
              </Button>
            </Link>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Kelas Tidak Ditemukan
              </h1>
              <p className="text-gray-600 mb-6">
                Kelas yang Anda cari tidak tersedia atau telah dihapus.
              </p>
              <Link href="/exclusive-class">
                <Button>Lihat Semua Kelas</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/exclusive-class">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              Kembali ke Daftar Kelas
            </Button>
          </Link>
        </div>

        {/* Class Detail Content */}
        <ClassDetail
          classData={
            classData as Parameters<typeof ClassDetail>[0]['classData']
          }
        />
      </div>
      <Footer />
    </div>
  );
}
