import HeroBanner from "@/components/hero-banner";
import MissionSection from "@/components/mission-section";
import FeatureSection from "@/components/feature-section";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  return (
    <div className="flex flex-col gap-0 pb-16">
      <HeroBanner />
      <MissionSection />
      <FeatureSection />
      <HomeClient />
    </div>
  );
}

