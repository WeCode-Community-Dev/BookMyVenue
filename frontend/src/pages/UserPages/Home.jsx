import { useEffect, useMemo, useState } from "react";
import { getVenues } from "../../services/venue.service.js";
import { getVenueCategories } from "../../services/venueCategory.service.js";
import HomeVenueSection from "../../components/user/HomeVenueSection.jsx";
import HomeBannerSection from "../../components/user/HomeBannerSection.jsx"

const HOME_SECTION_LIMIT = 4;

function getRandomCategories(categories, count = 2) {
  const shuffled = [...categories].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function Home() {
  const [categories, setCategories] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [valuePicks, setValuePicks] = useState([]);
  const [category1Venues, setCategory1Venues] = useState([]);
  const [category2Venues, setCategory2Venues] = useState([]);

  const selectedCategories = useMemo(() => {
    if (!categories.length) return [];

    const stored = sessionStorage.getItem("homeCategories");

    if (stored) {
      return JSON.parse(stored);
    }

    const categoryNames = categories.map(
      (category) => category.name
    );

    const randomCategories =
      getRandomCategories(categoryNames);

    sessionStorage.setItem(
      "homeCategories",
      JSON.stringify(randomCategories)
    );

    return randomCategories;
  }, [categories]);

  // Categories are needed first to resolve the random picks into identifiers
  // the backend can filter by.
  useEffect(() => {
    async function loadCategories() {
      try {
        const categoryResponse = await getVenueCategories();
        setCategories(categoryResponse);
      } catch (error) {
        console.error(error);
      }
    }

    loadCategories();
  }, []);

  const category1 = categories.find(
    (category) => category.name === selectedCategories[0]
  );

  const category2 = categories.find(
    (category) => category.name === selectedCategories[1]
  );

  // Each section is its own backend-sorted/filtered/limited query — the
  // server does the ordering (newest, cheapest, per-category) instead of the
  // client fetching everything and sorting/slicing it locally.
  useEffect(() => {
    async function loadTopPicks() {
      try {
        const response = await getVenues(1, {
          sort: "newest",
          limit: HOME_SECTION_LIMIT,
        });
        setTopPicks(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadTopPicks();
  }, []);

  useEffect(() => {
    async function loadValuePicks() {
      try {
        const response = await getVenues(1, {
          sort: "priceAsc",
          limit: HOME_SECTION_LIMIT,
        });
        setValuePicks(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadValuePicks();
  }, []);

  useEffect(() => {
    async function loadCategory1Venues() {
      if (!category1?.identifier) return;
      try {
        const response = await getVenues(1, {
          category: category1.identifier,
          limit: HOME_SECTION_LIMIT,
        });
        setCategory1Venues(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadCategory1Venues();
  }, [category1?.identifier]);

  useEffect(() => {
    async function loadCategory2Venues() {
      if (!category2?.identifier) return;
      try {
        const response = await getVenues(1, {
          category: category2.identifier,
          limit: HOME_SECTION_LIMIT,
        });
        setCategory2Venues(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadCategory2Venues();
  }, [category2?.identifier]);

  return (
    <div className="px-6 py-8">

      <HomeBannerSection />

      <HomeVenueSection
        title="Top Picks"
        venues={topPicks}
        showAllLink="/venue"
      />

      <HomeVenueSection
        title="Value Picks"
        venues={valuePicks}
        showAllLink="/venue"
      />

      {selectedCategories[0] && (
        <HomeVenueSection
          title={`Top ${selectedCategories[0]}`}
          venues={category1Venues}
          showAllLink={`/venue?category=${category1?.identifier}`}
        />
      )}

      {selectedCategories[1] && (
        <HomeVenueSection
          title={`Top ${selectedCategories[1]}`}
          venues={category2Venues}
          showAllLink={`/venue?category=${category2?.identifier}`}
        />
      )}

    </div>
  );
}