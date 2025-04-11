// src/components/JsonLd.tsx
import React from "react";

interface JsonLdProps {
  data: Record<string, any>;
}

const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLd;

// Helper functions for common JSON-LD types
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Oknum",
  url: "https://oknum.studio",
  logo: "https://oknum.studio/logo.png",
  sameAs: [
    "https://facebook.com/oknumstudio",
    "https://twitter.com/oknumstudio",
    "https://instagram.com/oknumstudio",
    "https://linkedin.com/company/oknum",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+62-812-3456-7890",
    contactType: "customer service",
    areaServed: "ID",
    availableLanguage: ["Indonesian", "English"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Teknologi Digital No. 123",
    addressLocality: "Tangerang Selatan",
    addressRegion: "Banten",
    postalCode: "15413",
    addressCountry: "ID",
  },
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Oknum - Digital Agency",
  url: "https://oknum.studio",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://oknum.studio/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export function createServiceJsonLd(
  name: string,
  description: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "Oknum",
      url: "https://oknum.studio",
    },
    url,
  };
}

export function createFaqJsonLd(
  questions: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

export function createBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
