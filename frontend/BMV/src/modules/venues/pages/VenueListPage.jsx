import { useEffect, useState } from "react";
import { getVenues } from "../services/venueService";

function VenueListPage() {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const data = await getVenues();
      setVenues(data);
    } catch (error) {
      console.error(error);
    }
  };
return (
  <div style={{ padding: "20px" }}>
    <h1>Venue List</h1>

    {venues.map((venue) => (
      <div
        key={venue.id}
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          marginBottom: "15px",
        }}
      >
        <h3>{venue.name}</h3>
        <p>Location: {venue.location}</p>
        <p>Price: Rs. {venue.price_per_day}</p>
        <p>Status: {venue.approval_status}</p>
      </div>
    ))}
  </div>
);
  
}

export default VenueListPage;

