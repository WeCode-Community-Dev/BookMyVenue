import { useState, useEffect } from "react";
import { getMyVenues, deleteVenue } from "../services/venueService";

/**
 * Custom hook to manage owner's venues
 * Fetches venues owned by the current logged-in user
 */
export const useMyVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyVenues = async () => {
    try {
      setLoading(true);
      const data = await getMyVenues();
      setVenues(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load your venues");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVenue = async (venueId) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) {
      return;
    }

    try {
      await deleteVenue(venueId);
      // Remove from local state
      setVenues(venues.filter((v) => v.id !== venueId));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.message || "Failed to delete venue" 
      };
    }
  };

  useEffect(() => {
    fetchMyVenues();
  }, []);

  return {
    venues,
    loading,
    error,
    refetch: fetchMyVenues,
    deleteVenue: handleDeleteVenue,
  };
};
