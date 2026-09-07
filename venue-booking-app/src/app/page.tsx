"use client";

import React from "react";
import SaasHero from "@/components/landing/SaasHero";
import PublicVenuesSection from "@/components/landing/PublicVenuesSection";
import SaaSFeatures from "@/components/landing/SaaSFeatures";
import WorkflowSteps from "@/components/landing/WorkflowSteps";
import HostCtaSection from "@/components/landing/HostCtaSection";
import FaqSection from "@/components/landing/FaqSection";
import SaasFooter from "@/components/landing/SaasFooter";

export default function Home() {
  return (
    <div className="flex-1 bg-background flex flex-col min-h-screen">
      {/* 1. High-End SaaS Hero Section */}
      <SaasHero />

      {/* 2. Public Venues Directory Catalog */}
      <PublicVenuesSection />

      {/* 3. SaaS Features & Architectural Capabilities */}
      <SaaSFeatures />

      {/* 4. Simple Step-by-Step Workflow */}
      <WorkflowSteps />

      {/* 5. Host Onboarding Call-To-Action */}
      <HostCtaSection />

      {/* 6. Interactive Public FAQ Accordion */}
      <FaqSection />

      {/* 7. Enterprise SaaS Footer */}
      <SaasFooter />
    </div>
  );
}
