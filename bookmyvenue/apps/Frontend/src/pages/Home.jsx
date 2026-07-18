import { useEffect, useState } from "react";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import AuthModal from "../pages/AuthModal";

import Hero from "../components/home/Hero";
import SearchBar from "../components/home/SearchBar";
import SearchResults from "../components/home/SearchResults";
import HomepageSections from "../components/home/HomepageSections";

import { useAuth } from "../context/AuthContext";
import { getCategories } from "../api/categories";
import { getHomepageData, getVenues } from "../api/venues";

function Home() {
  const { token, currentUser } = useAuth();

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [searchText, setSearchText] = useState("");
  const [city, setCity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [availabilityType, setAvailabilityType] = useState("");

  const [categories, setCategories] = useState([]);

  const [venues, setVenues] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [homepageLoading, setHomepageLoading] = useState(true);
  const [homepageError, setHomepageError] = useState("");

  const [topRatedVenues, setTopRatedVenues] = useState([]);
  const [recentlyAddedVenues, setRecentlyAddedVenues] = useState([]);
    const [categorySections, setCategorySections] = useState([]);

  const [visibleTopRated, setVisibleTopRated] = useState(4);
  const [visibleRecent, setVisibleRecent] = useState(4);
  const [visibleCategoryCounts, setVisibleCategoryCounts] = useState({});

  const [isSearchActive, setIsSearchActive] = useState(false);

  const limit = 16;

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
  };

  useEffect(() => {
    loadCategories();
    loadHomepage();
  }, []);

  useEffect(() => {
    const cleared =
      searchText.trim() === "" &&
      city.trim() === "" &&
      categoryId === "" &&
      availabilityType === "";

    if (cleared) {
      setIsSearchActive(false);
      setVenues([]);
      setTotal(0);
      setCurrentPage(1);
    }
  }, [searchText, city, categoryId, availabilityType]);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadHomepage() {
    try {
      const data = await getHomepageData();

      setTopRatedVenues(data.top_rated || []);
      setRecentlyAddedVenues(data.recently_added || []);
      setCategorySections(data.categories || []);
    } catch (err) {
      setHomepageError("Failed to load homepage.");
    } finally {
      setHomepageLoading(false);
    }
  }

  function buildSearchParams(page) {
    const params = {
      page,
      limit,
    };

    if (searchText.trim()) params.search = searchText.trim();
    if (city.trim()) params.city = city.trim();
    if (categoryId) params.category_id = categoryId;
    if (availabilityType)
      params.availability_type = availabilityType;

    return params;
  }

  function extractVenues(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.venues)) return data.venues;
    if (Array.isArray(data.items)) return data.items;
    return [];
  }

  function extractTotal(data) {
    if (typeof data.total === "number") return data.total;
    if (typeof data.count === "number") return data.count;
    if (Array.isArray(data)) return data.length;
    return 0;
  }

  async function fetchSearchResults(page) {
    try {
      setSearchLoading(true);
      setSearchError("");

      const data = await getVenues(buildSearchParams(page));

      setVenues(extractVenues(data));
      setTotal(extractTotal(data));
      setCurrentPage(page);
    } catch (err) {
      setSearchError("Failed to fetch venues.");
    } finally {
      setSearchLoading(false);
    }
  }

  function handleSearch() {
    const hasFilters =
      searchText.trim() ||
      city.trim() ||
      categoryId ||
      availabilityType;

    if (!hasFilters) {
      setIsSearchActive(false);
      return;
    }

    setIsSearchActive(true);
    fetchSearchResults(1);
  }

    function handlePageClick(page) {
    fetchSearchResults(page);
  }

  function handleLoadMore(type, categoryId) {
    if (type === "topRated") {
      setVisibleTopRated((prev) => prev + 4);
    } else if (type === "recentlyAdded") {
      setVisibleRecent((prev) => prev + 4);
    } else if (type === "category") {
      setVisibleCategoryCounts((prev) => ({
        ...prev,
        [categoryId]: (prev[categoryId] || 4) + 4,
      }));
    }
  }

  return (
    <>
      <Header
        cta={!token ? { label: "Sign in", onClick: openLogin } : undefined}
      />

      <main className="min-h-screen bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">

          {!isSearchActive && <Hero />}

          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            city={city}
            setCity={setCity}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            availabilityType={availabilityType}
            setAvailabilityType={setAvailabilityType}
            categories={categories}
            onSearch={handleSearch}
          />

          {isSearchActive ? (
            <SearchResults
              venues={venues}
              loading={searchLoading}
              error={searchError}
              currentPage={currentPage}
              total={total}
              limit={limit}
              onPageClick={handlePageClick}
            />
          ) : (
                        <HomepageSections
              loading={homepageLoading}
              error={homepageError}
              topRatedVenues={topRatedVenues}
              recentlyAddedVenues={recentlyAddedVenues}
              categorySections={categorySections}
              visibleTopRated={visibleTopRated}
              visibleRecent={visibleRecent}
              visibleCategoryCounts={visibleCategoryCounts}
              onLoadMore={handleLoadMore}
            />
          )}
        </div>
      </main>

      <Footer />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}

export default Home;
