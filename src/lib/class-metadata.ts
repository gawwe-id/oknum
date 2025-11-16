// src/lib/class-metadata.ts
import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { constructMetadata } from "./seo";

/**
 * Generate metadata for class detail page
 * @param classId - Class ID from URL params
 * @returns Metadata object for the class page
 */
export async function generateClassMetadata(
  classId: Id<"classes">
): Promise<Metadata> {
  const classData = await fetchQuery(api.classes.getClassByIdPublic, {
    classId,
  });

  if (!classData) {
    return constructMetadata({
      title: "Class Not Found - Oknum Studio",
      description: "The class you're looking for doesn't exist.",
      noIndex: true,
      pathname: `/exclusive-class/${classId}`,
    });
  }

  const { title, description, category, price, currency, expert, thumbnail } =
    classData;

  // Create description preview (first 150 chars, remove newlines)
  const descriptionPreview = description
    ? description.substring(0, 150).replace(/\n/g, " ").trim() + "..."
    : `Join ${title}, an exclusive class at Oknum Studio.`;

  // Build expert text
  const expertText = expert?.name ? ` by ${expert.name}` : "";

  // Format price
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency === "IDR" ? "IDR" : "USD",
    minimumFractionDigits: 0,
  }).format(price);

  // Build keywords array
  const keywords = [
    title,
    category,
    ...(expert?.name ? [expert.name] : []),
    "exclusive class",
    "oknum class",
    "premium class",
    formattedPrice,
  ];

  return constructMetadata({
    title: `${title} - Exclusive Class`,
    description: `${descriptionPreview}${expertText} Learn from industry experts and advance your career.`,
    keywords,
    ogImage: thumbnail,
    pathname: `/exclusive-class/${classId}`,
  });
}

