import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../../api/api";


const EditVenuePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newDocuments, setNewDocuments] = useState<{
        owner_id_proof: File | null;
        ownership_proof: File | null;
        business_registration: File | null;
      }>({
      owner_id_proof: null,
      ownership_proof: null,
      business_registration: null,
    });

  

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    city: "",
    capacity: 0,
    base_price: 0,
  });

  const loadVenue = async () => {

    try{
        const response = await api.get(`/venues/owner/${id}`);
        console.log(response.data);
        setImages(response.data.images);
        setDocuments(response.data.documents);

        setFormData({
          name: response.data.venue.name,
          category: response.data.venue.category,
          description: response.data.venue.description,
          address: response.data.venue.address,
          city: response.data.venue.city,
          capacity: response.data.venue.capacity,
          base_price: response.data.venue.base_price,

          });
        }catch(error){

          console.error(error);
          alert("failed to load venue.");

        }
      };

  useEffect(() => {

     loadVenue();

  }, []);

  const handleSubmit = async (
      event: React.FormEvent<HTMLFormElement>
    ) => {

      event.preventDefault();

      try{
        const data = new FormData();

        data.append("name", formData.name);
        data.append("category", formData.category);
        data.append("description", formData.description);
        data.append("address", formData.address);
        data.append("city", formData.city);
        data.append("capacity", formData.capacity.toString());
        data.append("base_price", formData.base_price.toString());

        for (const image of newImages) {
                  data.append("venue_images", image);
            }
        
        if (newDocuments.owner_id_proof) {
          data.append(  "owner_id_proof", newDocuments.owner_id_proof);
          }

        if (newDocuments.ownership_proof) {
          data.append(  "ownership_proof",  newDocuments.ownership_proof);
          }

        if (newDocuments.business_registration) {
          data.append(  "business_registration",  newDocuments.business_registration);
          }


        await api.put(`/venues/owner/${id}`, data);

        alert("Venue updated successfully!");

        navigate("/owner/dashboard");

      }catch(error){
        console.error(error);
        alert("Failed to update venue")
      }
    };

  return (
      <div className="edit-venue-container">
      <h1>Edit Venue</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">

        <div className="full-width form-group">
          <label>Venue Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />
        </div>

        <div >
          <label>Category</label>

          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
              })
            }
          >
            <option value="auditorium">Auditorium</option>
            <option value="banquet_hall">Banquet Hall</option>
            <option value="conference_hall">Conference Hall</option>
            <option value="meeting_hall">Meeting Hall</option>
            <option value="open_space">Open Space</option>
            <option value="rooftop">Rooftop</option>
            <option value="studio">Studio</option>
            <option value="cafe_space">Cafe Space</option>
            <option value="outdoor_event_space">Outdoor event space</option>
          </select>
        </div>

        <div className="full-width form-group">
            <label>Address</label>

             <textarea
                 rows={3}
                 value={formData.address}
                 onChange={ (e) =>
                    setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
              />
         </div>


        <div>
          <label>City</label>

          <input
            type="text"
            value={formData.city}
            onChange={(e) =>
              setFormData({
                ...formData,
                city: e.target.value,
              })
            }
          />
        </div>

        <div className="full-width form-group">
          <label>Description</label>

          <textarea
            rows={5}
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Capacity</label>

          <input
            type="number"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({
                ...formData,
                capacity: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label>Base Price (€)</label>

          <input
            type="number"
            value={formData.base_price}
            onChange={(e) =>
              setFormData({
                ...formData,
                base_price: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="venue-images-section full-width">

          <h2 className="venue-images-title">
            Venue Images
          </h2>

          <div className="venue-images-grid">
            {images.map((image) => (
            <img
              key={image.id}
              src={`http://localhost:5001/${image.file_path}`}
              alt="Venue"
              className="venue-image"
            />
            ))}
          </div>

        </div>

        <div className="upload-images-section full-width">

          <label>
              Choose New Images
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(event) => {

            if (!event.target.files) return;

            setNewImages(Array.from(event.target.files));

          }} />

        </div>

        <div className="documents-section full-width">

          <h2 className="documents-title">
          Documents
          </h2>

          {documents.map((document) => (

          <div
            key={document.id}
            className="document-card"
            >

            <h4>
             {document.document_type
               .split("_")
               .map(
                 (word: string) =>
                  word.charAt(0).toUpperCase() +
                  word.slice(1)
                )
              .join(" ")}
            </h4>

            <p>{document.file_name}</p>

            <input type="file" onChange={(event) => {

              if (!event.target.files?.[0]) return;

              setNewDocuments({
                  ...newDocuments,
                  [document.document_type]: event.target.files[0],
                });

                }}
            />

          </div>

          ))}

        </div>

        <br />

        <div className="button-row">
          <button type="submit">
          Save Changes
        </button>
        </div>

        </div>

      </form>
    </div>
  );
};

export default EditVenuePage;
