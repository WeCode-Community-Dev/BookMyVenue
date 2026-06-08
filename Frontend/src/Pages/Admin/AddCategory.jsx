import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAddCategoryMutation } from '../../redux/api/categoryApiSlice';



const AddCategory = () => {

    const [errors, setErrors] = useState({})
    const [name, setName] = useState("")

    const [addCategory,{isLoading}] = useAddCategoryMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newErrors = findFormErrors()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {

            try {

                await addCategory({ name }).unwrap()
                setName("");
                toast.success("Category added successfully");

            } catch (error) {
                console.log(error)
                toast.error(error?.data?.message || `error`);
            }
        }
    }
    const findFormErrors = () => {

        const newErrors = {}

        if (!name || name.length > 30) newErrors.name = 'Name must be atmost 30 characters long'
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
                     <Button class='bg-primary my-5 text-light' type='submit'>Submit</Button>
                </Form>
            </div>
        </>
    )
}
export default AddCategory