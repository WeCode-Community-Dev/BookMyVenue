import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { CheckDiamond } from "@mynaui/icons-react";

export const useAuthForm = () => {
    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState('');
    const [role, setRole] = useState('user');
    const [isLoginView, setIsLoginView] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    })
    setError('');
    setSuccessMessage('')
    }

    const toggleView = (e) => {
    e.preventDefault();
    setIsLoginView(!isLoginView);
    setError('');
    setSuccessMessage('')
    setFormData({ name: '', email: '', password: ''});
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')

    // validation for both login and sign up forms
    if(!formData.email || !formData.password){
        return setError('Please fill in all required fields.');
    }

    // validation for sign up form only
    if(!isLoginView){
        if(!formData.name) return setError('Please fill Your Name');
        if(formData.password.length < 6) return setError('Password must be at least 6 characters long.');
    }

    setIsLoading(true);

    try{
        const BASE_URL = "https://unsaving-channing-sisterly.ngrok-free.dev"

        const endpoint = isLoginView ? "/auth/login" : "/auth/signup";

        const payload = isLoginView
        ? {email: formData.email, password: formData.password}
        : {name: formData.name, email: formData.email, password: formData.password, role: role}

        const response = await fetch(BASE_URL + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
        })

        const data = await response.json();

        if(!response.ok){
        throw new Error(data.message || "Something went wrong. Please try again.");
        }
        
        console.log("Success! Data sent to server: ", data);

        if(data.access_token){
            localStorage.setItem('authToken', data.access_token);
            localStorage.setItem('userRole', data.user.role)
        }

        setSuccessMessage(isLoginView ? 'Logged in successfully!' : 'Account created successfully!')

        setTimeout(() => {
            if (data.user.role == "user"){
                navigate("/")
            } else if(data.user.role == "admin") {
                navigate("/admin")
            } else if(data.user.role == "owner"){
                navigate("/host")
            }
        }, 1000);
            

        } catch (err) {
            console.error("Error during form submission:", err);
            setError(err.message)

        } finally {
            setIsLoading(false);
        }
    }

    return {
        role, setRole,
        isLoginView, toggleView,
        formData, handleChange,
        error, isLoading, handleSubmit,
    }
}