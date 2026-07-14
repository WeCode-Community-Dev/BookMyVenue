import { HostCta } from './host-cta';
import { HowItWorks } from './how-it-works';
import { HeroSection } from './hero-section';
import { Testimonials } from './testimonials';
import { FeaturedVenues } from './featured-venues';
import { PopularCategories } from './popular-categories';

export function LandingView() {
    return (
        <>
            <HeroSection />
            <PopularCategories />
            <FeaturedVenues />
            <HowItWorks />
            <Testimonials />
            <HostCta />
        </>
    );
}
