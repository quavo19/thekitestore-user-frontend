import { AboutHero } from "@/components/about/AboutHero";
import {
  AboutMissionVision,
  AboutOverview,
  AboutServices,
  AboutValues,
} from "@/components/about/AboutContentSections";
import { AboutWhyChooseUs } from "@/components/about/AboutWhyChooseUs";
import { Footer } from "@/components/layout/Footer";

export function AboutPage() {
  return (
    <div className="space-y-16 pb-4 sm:space-y-20 sm:pb-6">
      <AboutHero />
      <AboutWhyChooseUs />
      <AboutOverview />
      <AboutMissionVision />
      <AboutValues />
      <AboutServices />
      <Footer />
    </div>
  );
}
