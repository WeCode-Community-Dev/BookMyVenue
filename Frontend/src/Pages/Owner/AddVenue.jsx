
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useAddVenueMutation } from '../../redux/api/venueApiSlice';
import { toast } from 'react-toastify';



const AddVenue = () => {

    const [errors, setErrors] = useState({})
    const [name, setName] = useState("")
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [capacity, setCapacity] = useState('')
    const [phone, setPhone] = useState('')
    const [imagesState, setImagesState] = useState([]);
    const [userinfo, setUserInfo] = useState({
        languages: [],
        response: [],
    });

    const handleChange = (e) => {
        const { value, checked } = e.target;
        const { languages } = userinfo;

        console.log(`${value} is ${checked}`);

        // Case 1 : The user checks the box
        if (checked) {
            setUserInfo({
                amenities: [...languages, value],
                response: [...languages, value],
            });
        }

        // Case 2  : The user unchecks the box
        else {
            setUserInfo({
                languages: languages.filter(
                    (e) => e !== value
                ),
                response: languages.filter(
                    (e) => e !== value
                ),
            });
        }
    };

    const [addVenue, { isloading }] = useAddVenueMutation()

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
                data.append("capacity", capacity);
                data.append("phone", phone);
                for (let i = 0; i < imagesState.length; i++) {
                    let file = imagesState[i];
                    data.append("image", file);
                }
                await addVenue(data).unwrap()
                toast.success("venue added successfully");

            } catch (error) {
                console.log(error)
                toast.error(error?.data?.message || `error`);
            }
        }
    }

    const findFormErrors = () => {

        const newErrors = {}

        if (!name || name.length > 30) newErrors.name = 'Name must be atmost 30 characters long'
        if (!description || description.length > 50) newErrors.description = 'Description must be atmost 50 characters long'
        //if (!type) newErrors.type = 'type is required'
        if (!price || price <= 0 || price > 1000000) newErrors.price = 'Enter valid price';
        if (!capacity || capacity <= 0 || capacity > 5000) newErrors.capacity = 'Enter valid capacity';
        if (!phone || phone.length > 10) newErrors.phone = 'Add a valid phone number'
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


                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-check m-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="languages"
                                        value="Javascript"
                                        id="flexCheckDefault"
                                        onChange={
                                            handleChange
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="flexCheckDefault"
                                    >
                                        &nbsp; Javascript
                                    </label>
                                </div>
                                <div className="form-check m-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="languages"
                                        value="Python"
                                        id="flexCheckDefault"
                                        onChange={
                                            handleChange
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="flexCheckDefault"
                                    >
                                        &nbsp; Python
                                    </label>
                                </div>
                                <div className="form-check m-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="languages"
                                        value="Java"
                                        id="flexCheckDefault"
                                        onChange={
                                            handleChange
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="flexCheckDefault"
                                    >
                                        &nbsp; Java
                                    </label>
                                </div>
                                <div className="form-check m-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="languages"
                                        value="PHP"
                                        id="flexCheckDefault"
                                        onChange={
                                            handleChange
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="flexCheckDefault"
                                    >
                                        &nbsp; PHP
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-check m-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="languages"
                                        value="C#"
                                        id="flexCheckDefault"
                                        onChange={
                                            handleChange
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="flexCheckDefault"
                                    >
                                        &nbsp; C#
                                    </label>
                                </div>
                                <div className="form-check m-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="languages"
                                        value="C++"
                                        id="flexCheckDefault"
                                        onChange={
                                            handleChange
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="flexCheckDefault"
                                    >
                                        &nbsp; C++
                                    </label>
                                </div>
                                <div className="form-check m-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="languages"
                                        value="C"
                                        id="flexCheckDefault"
                                        onChange={
                                            handleChange
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="flexCheckDefault"
                                    >
                                        &nbsp; C
                                    </label>
                                </div>
                                <div className="form-check m-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="languages"
                                        value="Typescript"
                                        id="flexCheckDefault"
                                        onChange={
                                            handleChange
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="flexCheckDefault"
                                    >
                                        &nbsp; Typescript
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="form-control mt-3 mb-3 text-center">
                            <label htmlFor="exampleFormControlTextarea1">
                                You're proficient in the
                                following languages :{" "}
                            </label>
                            <textarea
                                className="form-control text"
                                name="response"
                                value={userinfo.response}
                                placeholder="The checkbox values will be displayed here "
                                id="floatingTextarea2"
                                style={{ height: "150px" }}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                    <Button class='bg-primary my-5 text-light' type='submit'>Submit</Button>
                </Form>
            </div>
        </>
    )
}

export default AddVenue