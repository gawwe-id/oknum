import React from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { Star, Users, BookOpen, Mail, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { generateExpertMetadata } from "@/lib/expert-metadata";
import type { Metadata } from "next";

// Generate metadata dynamically based on expert data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return generateExpertMetadata(slug);
}

export default async function ExpertDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const expertData = await fetchQuery(api.experts.getExpertBySlug, { slug });

  if (expertData === undefined) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center">
            <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 mx-auto mb-8" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
              <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
              <Skeleton className="h-4 w-3/4 max-w-2xl mx-auto" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!expertData) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Expert Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The expert you're looking for doesn't exist.
            </p>
            <Link href="/our-experts">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Experts
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const { classes, ...expert } = expertData;
  const initials = expert.name
    ? expert.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "E";

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency === "IDR" ? "IDR" : "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-12 max-w-6xl">
            <Link href="/our-experts">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Experts
              </Button>
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Image */}
              <div className="shrink-0">
                {expert.profileImage ? (
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-emerald-100">
                    <Image
                      src={expert.profileImage}
                      alt={expert.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl md:text-4xl font-semibold border-4 border-emerald-200">
                    {initials}
                  </div>
                )}
              </div>

              {/* Expert Info */}
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {expert.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Mail className="w-4 h-4" />
                  <span>{expert.email}</span>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  {expert.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-900">
                        {expert.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {expert.totalStudents && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span>{expert.totalStudents} Students</span>
                    </div>
                  )}
                  {classes && classes.length > 0 && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <BookOpen className="w-5 h-5" />
                      <span>{classes.length} Classes</span>
                    </div>
                  )}
                </div>

                {/* Specializations */}
                {expert.specialization && expert.specialization.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {expert.specialization.map((spec, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 bg-emerald-50"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Bio Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {expert.bio}
                  </p>
                </CardContent>
              </Card>

              {/* Experience Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {expert.experience}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Classes Section */}
              {classes && classes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Classes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {classes.map((classItem) => (
                      <Link
                        key={classItem._id}
                        href={`/exclusive-class/${classItem._id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition-all"
                      >
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {classItem.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {classItem.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              classItem.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {classItem.status}
                          </Badge>
                          <span className="text-sm font-semibold text-emerald-600">
                            {formatPrice(classItem.price, classItem.currency)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
