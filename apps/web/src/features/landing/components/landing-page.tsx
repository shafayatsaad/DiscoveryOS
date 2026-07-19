// Purpose: Compose the DiscoveryOS landing page from reusable feature components.

import { CapabilitiesSection } from "@/features/landing/components/capabilities-section";
import { Footer } from "@/features/landing/components/footer";
import { HeroSection } from "@/features/landing/components/hero-section";
import { IntelligenceSection } from "@/features/landing/components/intelligence-section";
import { TopNav } from "@/features/landing/components/top-nav";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <TopNav />
      <main>
        <HeroSection />
        <IntelligenceSection />
        <CapabilitiesSection />
      </main>
      <Footer />
    </div>
  );
}

