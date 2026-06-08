
import { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useAddVenueMutation } from '../../redux/api/venueApiSlice';
import { toast } from 'react-toastify';
import { useListCategoriesQuery } from '../../redux/api/categoryApiSlice';

const AddVenue = () => {

    const [errors, setErrors] = useState({})
    const [name, setName] = useState("")
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [capacity, setCapacity] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')
    const [district, setDistrict] = useState('')
    const [state, setState] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [longitude, setLongitude] = useState('')
    const [latitude, setLatitude] = useState('')
    const [imagesState, setImagesState] = useState([]);
    const [userinfo, setUserInfo] = useState({
        amenities: [],
        response: [],
    });

    const [addVenue, { isloading }] = useAddVenueMutation()
    const { data } = useListCategoriesQuery()
    const categories = data?.categories

    const handleChange = (e) => {
        const { value, checked } = e.target;
        const { amenities } = userinfo;

        if (checked) {
            setUserInfo({
                amenities: [...amenities, value],
                response: [...amenities, value],
            });
        }

        else {
            setUserInfo({
                amenities: amenities.filter(
                    (e) => e !== value
                ),
                response: amenities.filter(
                    (e) => e !== value
                ),
            });
        }
    };



    const selectFilesHandler = async (e) => {
        const files = e.target.files;
        setImagesState(Array.from(files));
    };


    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = findFormErrors()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {

            try {
                const data = new FormData();
                data.append("name", name);
                data.append("description", description);
                data.append("price", price);
                data.append("category", category);
                data.append("capacity", capacity);
                data.append("city", city);
                data.append("state", state);
                data.append("district", district);
                data.append("zipcode", zipcode);
                data.append("longitude", longitude);
                data.append("latitude", latitude);
                data.append("phone", phone);
                for (let i = 0; i < userinfo.response.length; i++)
                    data.append('amenities', userinfo.response[i])
                for (let i = 0; i < imagesState.length; i++) {
                    let file = imagesState[i];
                    data.append("image", file);
                }
                await addVenue(data).unwrap()
                toast.success("venue added successfully");

            } catch (error) {
                toast.error(error?.data?.message || `error`);
            }
        }
    }

    const findFormErrors = () => {

        const newErrors = {}

        if (!name || name.length > 30) newErrors.name = 'Name must be atmost 30 characters long'
        if (!description || description.length > 50) newErrors.description = 'Description must be atmost 50 characters long'
        if (!category) newErrors.category = 'Category is required';
        if (!price || price <= 0 || price > 1000000) newErrors.price = 'Enter valid price';
        if (!capacity || capacity <= 0 || capacity > 5000) newErrors.capacity = 'Enter valid capacity';
        if (!phone || phone.length > 10) newErrors.phone = 'Add a valid phone number'
        if (!city || city.length > 25) newErrors.city = 'Enter a valid city'
        if (!district || district.length > 25) newErrors.district = 'Enter a valid district'
        if (!state || state.length > 25) newErrors.state = 'Enter a valid state'
        if (!zipcode || zipcode.length > 6) newErrors.zipcode = 'Enter a valid zipcode'
        if (!longitude) newErrors.longitude = 'Enter a valid longitude'
        if (!latitude) newErrors.latitude = 'Enter a valid latitude'
        if (!imagesState || imagesState.length === 0) newErrors.imagesState = "Add image"
        if (!userinfo.response || userinfo.response.length === 0) newErrors.amenities = "Add amenities"
        return newErrors
    }

    return (
        <>
            <div>AddVenue</div>
            <div className='App d-flex flex-column align-items-center'>
                <h1>Add Venue</h1>
                <Form style={{ width: '300px' }} onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text' value={name}
                            onChange={(e) => setName(e.target.value)}
                            isInvalid={!!errors.name} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>description</Form.Label>
                        <Form.Control type='text' value={description}
                            onChange={(e) => setDescription(e.target.value)} isInvalid={!!errors.description} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.description}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridCategory">
                        <Form.Label className="caption">Category</Form.Label>
                        <Form.Select className="text-secondary"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            isInvalid={!!errors.category}>
                            <option value="">Choose...</option>
                            {categories?.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.category}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type='number' value={price}
                            onChange={(e) => setPrice(e.target.value)} isInvalid={!!errors.price} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.price}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Capacity</Form.Label>
                        <Form.Control type='number' value={capacity}
                            onChange={(e) => setCapacity(e.target.value)} isInvalid={!!errors.capacity} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.capacity}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type='text' value={phone}
                            onChange={(e) => setPhone(e.target.value)} isInvalid={!!errors.phone} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.phone}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <br />
                    <input
                        type="file"
                        name='image'
                        onChange={selectFilesHandler}
                        accept="image/*"
                        multiple="multiple"
                    />
                    <p className="text-danger">{errors.imagesState}</p>


                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-check m-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="amenities"
                                    value="Parking"
                                    id="flexCheckDefault"
                                    onChange={
                                        handleChange
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                >
                                    &nbsp; Parking
                                </label>
                            </div>
                            <div className="form-check m-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="amenities"
                                    value='AC'
                                    id="flexCheckDefault"
                                    onChange={
                                        handleChange
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                >
                                    &nbsp; AC
                                </label>
                            </div>
                            <div className="form-check m-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="amenities"
                                    value="Wifi"
                                    id="flexCheckDefault"
                                    onChange={
                                        handleChange
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                >
                                    &nbsp; Wifi
                                </label>
                            </div>
                            <div className="form-check m-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="amenities"
                                    value="Catering Service"
                                    id="flexCheckDefault"
                                    onChange={
                                        handleChange
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                >
                                    &nbsp; Catering Service
                                </label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-check m-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="amenities"
                                    value="Stage"
                                    id="flexCheckDefault"
                                    onChange={
                                        handleChange
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                >
                                    &nbsp; Stage
                                </label>
                            </div>
                            <div className="form-check m-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="amenities"
                                    value="Sound System"
                                    id="flexCheckDefault"
                                    onChange={
                                        handleChange
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                >
                                    &nbsp; Sound System
                                </label>
                            </div>
                            <div className="form-check m-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="amenities"
                                    value="Dining Area"
                                    id="flexCheckDefault"
                                    onChange={
                                        handleChange
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                >
                                    &nbsp; Dining Area
                                </label>
                            </div>
                            <div className="form-check m-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="amenities"
                                    value="Lift/Elevator"
                                    id="flexCheckDefault"
                                    onChange={
                                        handleChange
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="flexCheckDefault"
                                >
                                    &nbsp; Lift/Elevator
                                </label>
                            </div>
                            <p className="text-danger">{errors.amenities}</p>
                        </div>
                    </div>

                    <Form.Group>
                        <Form.Label>City</Form.Label>
                        <Form.Control type='text' value={city}
                            onChange={(e) => setCity(e.target.value)} isInvalid={!!errors.city} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.city}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>District</Form.Label>
                        <Form.Control type='text' value={district}
                            onChange={(e) => setDistrict(e.target.value)} isInvalid={!!errors.district} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.district}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>State</Form.Label>
                        <Form.Control type='text' value={state}
                            onChange={(e) => setState(e.target.value)} isInvalid={!!errors.state} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.state}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Zipcode</Form.Label>
                        <Form.Control type='text' value={zipcode}
                            onChange={(e) => setZipcode(e.target.value)} isInvalid={!!errors.zipcode} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.zipcode}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Longitude</Form.Label>
                        <Form.Control type='number' value={longitude}
                            onChange={(e) => setLongitude(e.target.value)} isInvalid={!!errors.longitude} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.longitude}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Latitude</Form.Label>
                        <Form.Control type='number' value={latitude}
                            onChange={(e) => setLatitude(e.target.value)} isInvalid={!!errors.latitude} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.latitude}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button class='bg-primary my-5 text-light' type='submit'>Submit</Button>
                </Form>
            </div>
        </>
    )
}

export default AddVenue