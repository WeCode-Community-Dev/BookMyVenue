
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';



const AddVenue = () => {

    const [errors, setErrors] = useState({})
    const [name, setName] = useState("")
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [capacity, setCapacity] = useState('')
    const [phone, setPhone] = useState('')


    const handleSubmit = e => {
        e.preventDefault()
        const newErrors = findFormErrors()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {

            alert('Thank you for your feedback!')
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

                    <Button type='submit'>Submit</Button>
                </Form>
            </div>
        </>
    )
}

export default AddVenue