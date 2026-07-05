import { useEffect, useState } from "react";
import { getVenueById } from "../services/venueService";

function VenueDetailPage() {
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    loadVenue();
  }, []);

  const loadVenue = async () => {
    try {
      const data = await getVenueById(1);
      setVenue(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!venue) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{venue.name}</h1>
      <p>Location: {venue.location}</p>
      <p>Price: Rs. {venue.price_per_day}</p>
      <p>Status: {venue.approval_status}</p>
    </div>
  );
}

export default VenueDetailPage;