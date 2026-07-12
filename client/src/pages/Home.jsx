import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTownSuggestions } from "../services/venueService";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";
function Home() {
  usePageTitle("Home");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [district, setDistrict] = useState("");
  const [town, setTown] = useState("");
  const [category, setCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [listVenueMessage, setListVenueMessage] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [townSuggestions, setTownSuggestions] = useState([]);
  const [showTownSuggestions, setShowTownSuggestions] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTownSuggestions = async () => {
      const keyword = town.trim();

      if (keyword.length < 1) {
        setTownSuggestions([]);
        setShowTownSuggestions(false);
        return;
      }

      try {
        const result = await getTownSuggestions({
          district,
          keyword,
        });

        if (isMounted) {
          setTownSuggestions(result.data || []);
          setShowTownSuggestions((result.data || []).length > 0);
        }
      } catch {
        if (isMounted) {
          setTownSuggestions([]);
          setShowTownSuggestions(false);
        }
      }
    };

    loadTownSuggestions();

    return () => {
      isMounted = false;
    };
  }, [district, town]);

  const handleSelectTown = (selectedTown) => {
    setTown(selectedTown);
    setTownSuggestions([]);
    setShowTownSuggestions(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - timezoneOffset)
      .toISOString()
      .split("T")[0];
  };

  const handleManualSearch = (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();

    if (district) queryParams.set("district", district);
    if (town) queryParams.set("town", town);
    if (category) queryParams.set("category", category);
    if (eventDate) queryParams.set("eventDate", eventDate);

    navigate(`/venues?${queryParams.toString()}`);
  };

  const handleUseCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const queryParams = new URLSearchParams();

        queryParams.set("lat", latitude);
        queryParams.set("lng", longitude);

        if (category) queryParams.set("category", category);
        if (eventDate) queryParams.set("eventDate", eventDate);

        navigate(`/venues/nearby?${queryParams.toString()}`);

        setLocationLoading(false);
      },
      () => {
        setLocationError("Unable to access your location. Use manual search.");
        setLocationLoading(false);
      }
    );
  };

  const handleListVenue = () => {
    if (!user) {
      navigate("/register?role=owner");
      return;
    }

    if (user.role === "owner") {
      navigate("/owner/venues/new");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    setListVenueMessage("Please use an owner account to list venues.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf7f5] to-white">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center">


          <h1 className="mt-8 text-6xl md:text-8xl font-semibold leading-[1.05] tracking-tight text-gray-900">
            Find the{" "}
            <span className="bg-gradient-to-r from-red-600 to-[#4a1625] bg-clip-text text-transparent">
              perfect venue
            </span>
            <br />
            for every occasion
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed font-normal">
            Discover wedding halls, conference centers, resorts,
            auditoriums, party venues and outdoor spaces across Kerala.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              to="/venues"
              className="px-10 py-4 rounded-2xl text-lg font-medium text-white bg-gradient-to-r from-red-600 via-red-700 to-[#4a1625] shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              🔍 Browse Venues
            </Link>

            <button
              type="button"
              onClick={handleListVenue}
              className="px-10 py-4 rounded-2xl text-lg font-medium bg-white border-2 border-[#8b1e2d] text-[#8b1e2d] hover:bg-[#8b1e2d] hover:text-white shadow-lg hover:scale-105 transition-all duration-300"
            >
              🏢 List Your Venue
            </button>
          </div>
        </div>

        {listVenueMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
              <h2 className="text-2xl font-semibold text-[#4a1625]">
                Owner Account Required
              </h2>

              <p className="mt-3 text-gray-600">
                {listVenueMessage}
              </p>

              <button
                type="button"
                onClick={() => setListVenueMessage("")}
                className="mt-6 px-6 py-3 rounded-xl bg-[#8b1e2d] text-white font-semibold hover:bg-[#6f1824] transition"
              >
                OK
              </button>
            </div>
          </div>
        )}


        {/* Search Card */}
        <form
          onSubmit={handleManualSearch}
          className="mt-20 bg-white rounded-[32px] shadow-2xl border border-gray-100 p-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-semibold text-gray-900">
                Find Your Perfect Venue
              </h2>
              <p className="mt-2 text-gray-500">
                Search by location, date, and venue category.
              </p>
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locationLoading}
              className="px-6 py-4 rounded-2xl border-2 border-[#8b1e2d] text-[#8b1e2d] bg-white font-medium shadow-md hover:bg-[#8b1e2d] hover:text-white hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {locationLoading ? "Getting Location..." : "📍 Use Current Location"}
            </button>
          </div>

          {locationError && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {locationError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                District
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
              >
                 <option value="" disabled selected>Select district</option>
                <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                <option value="Kollam">Kollam</option>
                <option value="Pathanamthitta">Pathanamthitta</option>
                <option value="Alappuzha">Alappuzha</option>
                <option value="Kottayam">Kottayam</option>
                <option value="Idukki">Idukki</option>
                <option value="Ernakulam">Ernakulam</option>
                <option value="Thrissur">Thrissur</option>
                <option value="Palakkad">Palakkad</option>
                <option value="Malappuram">Malappuram</option>
                <option value="Kozhikode">Kozhikode</option>
                <option value="Wayanad">Wayanad</option>
                <option value="Kannur">Kannur</option>
                <option value="Kasaragod">Kasaragod</option>    
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Town/Area
              </label>

              <input
                type="text"
                placeholder="Town/Area"
                value={town}
                onChange={(e) => {
                  setTown(e.target.value);
                  setShowTownSuggestions(true);
                }}
                onFocus={() => {
                  if (town.trim().length > 0 && townSuggestions.length > 0) {
                    setShowTownSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowTownSuggestions(false);
                  }, 150);
                }}
                className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
              />

              {showTownSuggestions && townSuggestions.length > 0 && (
                <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                  {townSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={() => handleSelectTown(suggestion)}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-[#8b1e2d] transition"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={getTodayDate()}
                className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
              >
                <option value="">Venue Type</option>
                <option value="banquet hall">Banquet Hall</option>
                <option value="auditorium">Auditorium</option>
                <option value="convention center">Convention Center</option>
                <option value="outdoor">Outdoor</option>
                <option value="rooftop">Rooftop</option>
                <option value="resort">Resort</option>
                <option value="hotel ballroom">Hotel Ballroom</option>
                <option value="community hall">Community Hall</option>
                <option value="wedding hall">Wedding Hall</option>
                <option value="conference room">Conference Room</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="px-14 py-4 bg-gradient-to-r from-red-600 to-[#4a1625] text-white text-lg font-medium rounded-2xl shadow-xl hover:scale-105 transition-all duration-300"
            >
              Search Venues
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="mt-24 flex flex-wrap justify-center gap-20 text-center">
          <div>
            <h2 className="text-5xl font-semibold text-[#8b1e2d]">2.4k+</h2>
            <p className="text-gray-600 text-lg font-medium mt-2">
              Venues Listed
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-semibold text-[#8b1e2d]">180+</h2>
            <p className="text-gray-600 text-lg font-medium mt-2">
              Cities Covered
            </p>
          </div>

          <div>
            <h2 className="text-5xl font-semibold text-[#8b1e2d]">50k+</h2>
            <p className="text-gray-600 text-lg font-medium mt-2">
              Successful Bookings
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
