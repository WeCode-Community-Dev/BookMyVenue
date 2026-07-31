import { useState } from "react";
import ImageDropzone from "../../components/ImageDropzone";
import api from "../../services/api";

function AddVenuePage (){
  const[name,setName] = useState("");
  const[category,setCategory] = useState("");
  const[description, setDescription] = useState("");
  const[address , setAddress] = useState("");
  const[city ,setCity]= useState("");
  const[capacity, setCapacity] = useState("");
  const[basePrice, setBasePrice] = useState("");
  

  const[ownerIdProof, setOwnerIdProof] = useState<File | null>(null);
  const[ownershipProof, setOwnershipProof] = useState<File | null>(null);
  const[businessRegistration, setBusinessRegistration] = useState<File | null>(null);
  const [images, setImages] = useState<{file: File; preview: string;}[]>([]);

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("capacity", capacity);
    formData.append("base_price", basePrice);

    if (ownerIdProof) {
      formData.append("owner_id_proof", ownerIdProof);
    }

    if (ownershipProof) {
      formData.append("ownership_proof", ownershipProof);
    }

    if (businessRegistration) {
      formData.append(
        "business_registration",
        businessRegistration
      );
    }

    images.forEach((image) => {
      formData.append("venue_images", image.file);
    });

    const response = await api.post(
      "/venues",
      formData
    );

    alert(response.data.message);

    setName("");
    setCategory("");
    setDescription("");
    setAddress("");
    setCity("");
    setCapacity("");
    setBasePrice("");

    setOwnerIdProof(null);
    setOwnershipProof(null);
    setBusinessRegistration(null);

    setImages([]);
  } catch (error) {
    console.error(error);
    alert("Failed to create venue");
  }
};

  return(
    <div style = {{ padding : "20px", maxWidth : "800px" ,margin: "0 auto",}}>
      <h1>Add Venue</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Venue name</label>
          <br/>
          <input type ="text" value={name} onChange={(e)=> setName(e.target.value) } />
        </div>

        <br/>

       <div>
          <label>Venue Category</label>
          <br />

        <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              >
            <option value="">-- Select a Category --</option>

            <option value="auditorium">Auditorium</option>

            <option value="banquet_hall">Banquet Hall</option>

            <option value="conference_hall">Conference Hall</option>

            <option value="meeting_hall">Meeting Hall</option>

            <option value="open_space">Open Space</option>

            <option value="outdoor_event_space">Outdoor Event Space </option>

            <option value="cafe_space">Café Space</option>

            <option value="rooftop">Rooftop</option>

            <option value="studio">Studio</option>
        </select>
          </div>

        <br/>

        <div>
          <label>Description</label>
          <br/>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>

        <br/>

        <div>
          <label>Address</label>
          <br/>
          <input type ="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <br/>

        <div>
          <label>City</label>
          <br/>
          <input type = "text" value ={city} onChange={(e) => setCity(e.target.value)} />
        </div>

        <br/>

        <div>
          <label>Capacity</label>
          <br/>
          <input type= "number" value={capacity} onChange={(e)=> setCapacity(e.target.value)}/>
        </div>

        <br/>

        <div>
          <label>Base price</label>
          <br/>
          <input type ="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)}/>
        </div>

        <br/>

        <div>
          <label>Owner's Id proof</label>
          <br/>
          <input type ="file" onChange={(e) => setOwnerIdProof(e.target.files ? e.target.files[0] : null)}/>
        </div>

        <br/>

        <div>
          <label>Venue's Ownership Proof</label>
          <br />
          <input
            type="file"
            onChange={(e) =>setOwnershipProof(e.target.files ? e.target.files[0] : null)}/>
        </div>

        <br/>

        <div>
          <label>Business Registration</label>
          <br/>
          <input type ="file" onChange={(e) =>setBusinessRegistration(e.target.files ? e.target.files[0] : null) } />
        </div>

        <br/>

        <div>
          <label>Venue Photos</label>
        <br />
        <br />

        <ImageDropzone images={images}setImages={setImages}/>
        
        </div>

        <button type="submit">Add venue</button>

      </form>
    
    </div>
  );
}

export default AddVenuePage;