import { useEffect } from 'react';
import HeroSection from '@/features/public/components/sections/HeroSection';
import FeaturedSection from '@/features/public/components/sections/FeaturedSection';
import CategoriesSection from '@/features/public/components/sections/CategoriesSection';
import EliteVenuesSection from '@/features/public/components/sections/EliteVenueSection';
import ExploreVenuesSection from '@/features/public/components/sections/ExploreVenuesSection';
import CTASection from '@/features/public/components/sections/CTASection';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { getHomeData, type HomeDataResponse } from '../services/home.services';

export default function HomePage() {
  const { data, loading, error, execute } = useAsyncFetch<HomeDataResponse>();

  useEffect(() => {
    execute(getHomeData);
  }, [execute]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (error) {
    console.error('Error fetching home page data:', error);
  }

  const venues = data?.venues || [];
  const categories = data?.categories || [];

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col gap-12 md:gap-16 pb-20 overflow-x-hidden transition-colors duration-300">
      <HeroSection />
      <FeaturedSection venues={venues} loading={loading} />
      <CategoriesSection categories={categories} loading={loading} />
      <EliteVenuesSection venues={venues} loading={loading} />
      <ExploreVenuesSection districts={data?.districts || []} loading={loading} />
      <CTASection />
    </div>
  );
}
