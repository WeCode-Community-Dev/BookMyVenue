import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";
import type { Venue } from "../../types/venue";
import "../../styles/OwnerVenueView.css";


function OwnerVenueView() {
    
    const { id } = useParams();
    const [venue, setVenue] = useState<Venue | null>(null);
    const [images, setImages] = useState<any[]>([]);
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(()=> {
        const fetchVenue =async() =>{
        try {
            const response = await api.get(`/venues/owner/${id}`);
             setVenue(response.data.venue);
             setImages(response.data.images);
             setDocuments(response.data.documents);
            }catch(error){
                console.error(error);

                setError("Failed to load venue");
            }finally{
             setLoading(false);
            }
        };
        fetchVenue();
    },[id]);

    if(loading){
        return <h2>Loading...</h2>
    }
    if (error){
        return <h2>{error}</h2>
    }

    if(!venue){
        return <h2>Venue not found.</h2>
    }

    console.log("Venue:", venue);

console.log("Images:", images);

console.log("Documents:", documents);
const statusLabels = {
    pending: "Verification Pending",
    approved: "Admin Approved",
    rejected: "Rejected",
};

    return (
        <div className="owner-venue-container">
            <div className="venue-header">

            <h1>{venue.name}</h1>

            <span className ={`status ${venue.approval_status}`}>{
                statusLabels[venue.approval_status as keyof typeof statusLabels]
                }
            </span>

            </div>
            <div className="venue-information">

            <p><strong>Category: </strong>{venue.category}</p>

            <p><strong>City:</strong> {venue.city}</p>

            <p><strong>Capacity:</strong> {venue.capacity}</p>

            <p><strong>Price: €</strong> {" "} {Number(venue.base_price).toLocaleString()}</p>  
            </div>

            <div className="venue-description">
                <h2>Description</h2>
                <p>Description : {venue.description}</p>
            </div>

            <div className="venue-images">
            <h2>Venue Images</h2>
            <div className="image-gallery">
                {images.map((image)=>(
                    <img
                        key ={image.id}
                        src ={`http://localhost:5001/${image.file_path}`}
                        alt={venue.name}
                        className="gallery-image"
                        />
                ))}

            </div>
            </div>

            <div className="venue-documents">

            <h2>Uploaded Documents</h2>
            <ul>
                {documents.map((document)=>(
                    <li key={document.id}>
                        <strong>{document.document_type}</strong>

                        {" "}
                        <a
                            href={`http://localhost:5001/${document.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View
                        </a>

                    </li>
                ))}
            </ul>
            </div>

        </div>
    );
}

export default OwnerVenueView;