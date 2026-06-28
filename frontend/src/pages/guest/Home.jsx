import Hero from "../../components/home/Hero";
import HowItWorks from "../../components/home/HowItWorks";
import FeaturedVenues from "../../components/home/FeaturedVenues";
import ProviderCTA from "../../components/home/ProviderCTA";

const Home = () => {
  return (
    <main className="flex flex-col">
      <Hero />

      <section className="bg-white">
        <FeaturedVenues />
      </section>

      <section>
        <HowItWorks />
      </section>

      <section className="bg-white">
        <ProviderCTA />
      </section>
    </main>
  );
};

export default Home;
