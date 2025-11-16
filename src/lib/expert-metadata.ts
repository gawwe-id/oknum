// src/lib/expert-metadata.ts
import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { constructMetadata } from "./seo";

/**
 * Generate metadata for expert detail page
 * @param slug - Expert slug from URL params
 * @returns Metadata object for the expert page
 */
export async function generateExpertMetadata(
  slug: string
): Promise<Metadata> {
  const expertData = await fetchQuery(api.experts.getExpertBySlug, { slug });

  if (!expertData) {
    return constructMetadata({
      title: "Expert Not Found - Oknum Studio",
      description: "The expert you're looking for doesn't exist.",
      noIndex: true,
      pathname: `/our-experts/${slug}`,
    });
  }

  const { name, bio, specialization, profileImage, slug: expertSlug } =
    expertData;

  // Create bio preview (first 150 chars, remove newlines)
  const bioPreview = bio
    ? bio.substring(0, 150).replace(/\n/g, " ").trim() + "..."
    : `Learn from ${name}, an expert instructor at Oknum Studio.`;

  // Build specialization text
  const specializationText =
    specialization && specialization.length > 0
      ? `Specializing in ${specialization.join(", ")}. `
      : "";

  // Build keywords array
  const keywords = [
    name,
    ...(specialization || []),
    "expert instructor",
    "oknum expert",
    "professional instructor",
  ];

  return constructMetadata({
    title: `${name} - Expert Instructor`,
    description: `${specializationText}${bioPreview}`,
    keywords,
    ogImage: profileImage,
    pathname: `/our-experts/${expertSlug || slug}`,
  });
}

