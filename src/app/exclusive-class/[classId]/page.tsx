import React from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ClassDetail from "@/views/exclusive-class/class-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { generateClassMetadata } from "@/lib/class-metadata";
import type { Metadata } from "next";

// Generate metadata dynamically based on class data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ classId: string }>;
}): Promise<Metadata> {
  const { classId } = await params;
  return generateClassMetadata(classId as Id<"classes">);
}

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const classData = await fetchQuery(api.classes.getClassByIdPublic, {
    classId: classId as Id<"classes">,
  });

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
            classData as Parameters<typeof ClassDetail>[0]["classData"]
          }
        />
      </div>
      <Footer />
    </div>
  );
}
