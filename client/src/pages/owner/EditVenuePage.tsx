import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import type { Venue } from "../../types/venue";


const EditVenuePage = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState<Venue | null>(null);
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
        setVenue(response.data.venue);

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

        console.log(formData);

        await api.put(`/venues/owner/${id}`, data);

        alert("Venue updated successfully!");

      }catch(error){
        console.error(error);
        alert("Failed to update venue")
      }
    };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Edit Venue</h1>

      <form onSubmit={handleSubmit}>

        <div>
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

        <div>
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

          <div>
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

        <div>
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

        <br />

        <button type="submit">
          Save Changes
        </button>

      </form>
    </div>
  );
};

export default EditVenuePage;
