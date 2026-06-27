import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import apiService from "../services/apiService"

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
        if(e){
            e.preventDefault();
        }
        setIsLoginView(!isLoginView);
        setError('');
        setSuccessMessage('');
        setFormData({ name: '', email: '', password: ''});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

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
            let data;

            if (isLoginView){
                data = await apiService.login({
                    email: formData.email,
                    password: formData.password
                })
            } else {
                data = await apiService.signup({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: role
                })
            }
            
            if(data.access_token){
                Cookies.set("authToken", data.access_token, {expires: 30, secure: true, sameSite: 'Lax'})
                Cookies.set('userRole', data.user.role, {expires: 30, secure: true, sameSite: 'Lax'})
                Cookies.set('userId', data.user.id, {expires: 30, secure: true, sameSite: 'Lax'})
                Cookies.set('userEmail', data.user.email, {expires: 30, secure: true, sameSite: 'Lax'})
                Cookies.set('userName', data.user.name, {expires: 30, secure: true, sameSite: 'Lax'})
            }

            setSuccessMessage(isLoginView ? 'Logged in successfully!' : 'Account created successfully!')

            setTimeout(() => {
                if(!isLoginView){
                    toggleView();
                    setSuccessMessage("Please Login with your new account.");
                    return;
                }

                if (data.user.role == "user"){
                    navigate("/")
                    console.log(data.user.role)
                } else if(data.user.role == "admin") {
                    navigate("/admin")
                } else if(data.user.role == "owner"){
                    navigate("/host")
                }
            }, 1000);

        } catch (err) {
            console.error("Error during form submission:", err.response?.data);
            const errMessage = err.response?.data?.detail || err.message || "An error Occured";
            setError(errMessage);

        } finally {
            setIsLoading(false);
        }
    }

    return {
        role, setRole,
        isLoginView, toggleView,
        formData, handleChange,
        error, isLoading, handleSubmit,
        successMessage
    }
}