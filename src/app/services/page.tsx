"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { HeroService } from "@/components/services/hero-service";
import { WebMobileSection } from "@/components/services/web-mobile";
import { AIAutomationsSection } from "@/components/services/ai-automations";
import { DigitalAdsSection } from "@/components/services/ads";
import { EcommerceSection } from "@/components/services/ecommerce";
import { CTASection } from "@/components/services/cta-section";
import { FloatingNav } from "@/components/services/floating-nav";

const ServicesPage = () => {
  const [activeSection, setActiveSection] = useState("web-mobile");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "web-mobile",
        "ai-automation",
        "digital-ads",
        "ecommerce",
      ];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <HeroService />

      {/* Floating Nav - Fixed Position */}
      <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40">
        <FloatingNav
          activeSection={activeSection}
          scrollToSection={scrollToSection}
        />
      </div>

      {/* Service Sections */}
      <div className="w-full">
        <WebMobileSection />
        <AIAutomationsSection />
        <DigitalAdsSection />
        <EcommerceSection />
      </div>

      <CTASection />

      <Footer />
    </div>
  );
};

export default ServicesPage;
