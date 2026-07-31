  import { useEffect, useState } from "react";
  import api from "../../api/api";
  import type { Venue } from "../../types/venue";
  import { useNavigate } from "react-router-dom";

  import "../../styles/OwnerDashboard.css";


  function OwnerDashboard() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const statusLabels = {
    pending: "Verification Pending",
    approved: "Admin Verified",
    rejected: "Admin Rejected",
};

    useEffect(() => {
      const fetchMyVenues = async () => {
        try {
          const response = await api.get("/venues/my-venues");

          setVenues(response.data.venues);
        } catch (error) {
          console.error(error);
          setError("Failed to load venues");
        } finally {
          setLoading(false);
        }
      };

      fetchMyVenues();
    }, []);

    if (loading) {
      return <h2>Loading...</h2>;
    }

    if (error) {
      return <h2>{error}</h2>;
    }

    return (
      <div style={{ padding: "20px" }}>
        <div>

        <h1>Owner Dashboard</h1>
          
          <button className="add-venue-btn" onClick={() => navigate("/owner/add-venue")}  >
              + Add Venue
          </button>

        <hr />
        </div> 
       
        <div>
        <h2>My Venues</h2>

        {venues.length === 0 ? (
          <p>No venues added yet.</p>
        ) : (
            venues.map((venue) => (
             <div key={venue.id} 
                  className = "venue-card">

              <div className="venue-image">
               {venue.thumbnail ? (
               <img
                    src={`http://localhost:5001/${venue.thumbnail}`}
                    alt={venue.name}
                    className="venue-thumbnail"
              />
              ) : (
                   <p>No Image Available</p>
                  )}
              </div>

             <div className ="venue-content">
                      <h2 className = "venue-name">{venue.name}</h2>
             

             <div className="venue-details">
               <p><strong>Category:</strong>{" "}
                {venue.category.split("_")
                .map(
                  (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(" ")}</p>
               <p><strong>City:</strong> {venue.city.charAt(0).toUpperCase() + venue.city.slice(1)}</p>
               <p><strong>Capacity:</strong> {venue.capacity} People</p>
               <p><strong>Price:</strong> €{Number(venue.base_price).toLocaleString()}</p>
              </div>

              <div className="venue-status">
                <span className={`status-badge ${venue.approval_status}`}>
                  {statusLabels[venue.approval_status]}
                </span>
              </div>

             <div className ="venue-actions"> 
              <button className="view-btn"
                  onClick={() => navigate(`/owner/venues/${venue.id}`)}>
                  View
              </button>
              
              <button className="edit-btn"
                  onClick={() => navigate(`/owner/venues/${venue.id}/edit`)}>
                  Edit
              </button>

              <button className="delete-btn">-Delete</button>
             </div>
            </div>
             </div>
              ))
        )}
      </div>
    </div>
    );
  }

  export default OwnerDashboard;