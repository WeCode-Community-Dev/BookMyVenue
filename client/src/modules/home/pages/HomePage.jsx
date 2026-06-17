import MainLayout from "../../common/MainLayout";

import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedVenuesSection from "../components/FeaturedVenuesSection";
import HowItWorksSection from "../components/HowItWorksSection";

const HomePage = () => {
  return (
    <MainLayout>
      <div className="font-sans bg-white text-gray-900 overflow-x-hidden">
        <HeroSection />

        <StatsSection />

        <CategoriesSection />

        <FeaturedVenuesSection />

        <HowItWorksSection />
      </div>
    </MainLayout>
  );
};

export default HomePage;