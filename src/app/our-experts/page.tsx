import React from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { constructMetadata } from "@/lib/seo";
import Navbar from "@/components/navbar";
import Hero from "@/components/vuehero";
import ExpertCard from "@/components/expert-card";
import type { Expert as ExpertType } from "@/components/expert-card";

export const metadata = constructMetadata({
  title: "Our Experts - Oknum Studio",
  description:
    "Meet our expert instructors who will guide you through your learning journey.",
});

export default async function OurExpertsPage() {
  const experts = await fetchQuery(api.experts.getActiveExperts);

  const hasSlug = (e: any): e is ExpertType =>
    typeof e?.slug === "string" && e.slug.length > 0;

  if (experts === undefined) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading experts...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Hero
        titlePart1="Expert"
        titleHighlight="Instructors"
        titlePart2="Yang Berpengalaman"
        description="Belajar dari para profesional industri yang menghadirkan pengalaman nyata dan keahlian untuk membantu Anda menguasai skill baru."
        highlightText="profesional industri"
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          {experts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                No experts available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(experts.filter(hasSlug) as ExpertType[]).map((expert) => (
                <ExpertCard key={expert._id} expert={expert as ExpertType} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
