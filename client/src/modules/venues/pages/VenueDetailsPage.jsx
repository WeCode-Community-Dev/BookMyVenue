import {
    useParams,
    useNavigate
 } from "react-router-dom";
 
 import {
    fetchVenueByIdApi
 } from "../api/venue.api";
 
 const VenueDetailsPage = () => {
 
    const { id } = useParams();
 
    const navigate = useNavigate();
 
    const [venue, setVenue] =
       useState(null);
 
    useEffect(() => {
 
       loadVenue();
 
    }, []);
 
    const loadVenue = async () => {
 
       const response =
          await fetchVenueByIdApi(id);
 
       setVenue(response.data);
 
    };
 
    if (!venue) {
 
       return <p>Loading...</p>;
 
    }
 
    return (
 
       <div>
 
          <h1>
             {venue.name}
          </h1>
 
          <VenueGallery
             images={venue.images}
          />
 
          <p>
             {venue.description}
          </p>
 
          <button
             className="btn-primary"
             onClick={() =>
                navigate(
                   `/venues/${venue.id}/book`
                )
             }
          >
             Book Now
          </button>
 
       </div>
 
    );
 
 };
 
 export default VenueDetailsPage;