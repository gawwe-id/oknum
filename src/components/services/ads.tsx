"use client";

import React from "react";
import { ServiceCard } from "./service-card";
import { ContentSection } from "./content-section";
import { services } from "./types";

export const DigitalAdsSection = () => {
  return (
    <section id="digital-ads" className="bg-white py-12 md:py-16 scroll-mt-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          <div className="flex items-center justify-center">
            <ServiceCard service={services[2]} />
          </div>
          <ContentSection service={services[2]} />
        </div>
      </div>
    </section>
  );
};
