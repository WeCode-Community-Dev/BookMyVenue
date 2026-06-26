import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { getMyVenues } from "../../api/venue";

function OwnerDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMyVenues() {
      try {
        const data = await getMyVenues(token);

        // This handles both possible backend responses:
        // 1. Direct array: [...]
        // 2. Object with venues: { venues: [...] }
        if (Array.isArray(data)) {
          setVenues(data);
        } else if (Array.isArray(data.venues)) {
          setVenues(data.venues);
        } else {
          setVenues([]);
        }
      } catch (err) {
        setError(
          err.response?.data?.detail || "Failed to load your venues"
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadMyVenues();
    }
  }, [token]);

  if (loading) {
    return <p>Loading your venues...</p>;
  }

  return (
    <div>
      <h1>Owner Dashboard</h1>

      <button onClick={() => navigate("/owner/create-venue")}>
        List a Venue
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!error && venues.length === 0 && (
        <div>
          <p>You have no venues listed yet</p>

          <button onClick={() => navigate("/owner/create-venue")}>
            List a Venue
          </button>
        </div>
      )}

      {venues.length > 0 && (
        <div>
          {venues.map((venue) => (
            <div
              key={venue.id}
              style={{
                border: "1px solid #ccc",
                padding: "16px",
                marginTop: "16px",
                borderRadius: "8px",
              }}
            >
              <h2>{venue.name}</h2>

              <p>
                <strong>City:</strong> {venue.city}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {venue.status || "Not available"}
              </p>

              <p>
                <strong>Supports Hourly:</strong>{" "}
                {venue.supports_hourly ? "Yes" : "No"}
              </p>

              {venue.supports_hourly && (
                <p>
                  <strong>Hourly Price:</strong> ₹{venue.hourly_price}
                </p>
              )}

              <p>
                <strong>Supports Daily:</strong>{" "}
                {venue.supports_daily ? "Yes" : "No"}
              </p>

              {venue.supports_daily && (
                <p>
                  <strong>Daily Price:</strong> ₹{venue.daily_price}
                </p>
              )}

              <button onClick={() => navigate(`/venues/${venue.id}`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;