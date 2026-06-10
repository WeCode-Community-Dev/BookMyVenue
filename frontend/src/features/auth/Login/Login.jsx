import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import logo from '../../../assets/images/bookmyvenue_logo.png';
import './login.scss';
import { useLoginMutation } from '../authApi.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../redux/slices/authSlice.js';
import { useSelector } from 'react-redux';
import {selectCurrentUser,selectIsAuthenticated} from '../../../redux/slices/authSlice.js';



export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  console.trace("LOGIN RENDERING TRACE");

const navigate = useNavigate();
const dispatch = useDispatch();

const currentUser = useSelector(selectCurrentUser);

const hanldeChange = (e) => {
  const {name,value} = e.target;
  setFormData(prev => ({...prev, [name]: value}));
}
  const [errorMsg, setErrorMsg] = useState("");
  const [login , {data,error,isLoading,isSuccess,isError}] = useLoginMutation();

  const handleSubmit = async() => {
    setErrorMsg("");
    try {
      const loginData = await login(formData).unwrap();
      dispatch(setCredentials(loginData.data));
      if(loginData?.data?.role === "owner"){
        navigate("/owner/dashboard");
      } else {
        navigate("/browse-venues");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMsg(err?.data?.message || err?.message || "Login failed. Please check your credentials.");
    }
  };

  const isAuthenticated = useSelector(selectIsAuthenticated);
console.log("LOGIN RENDERING - isAuthenticated:", isAuthenticated)


// useEffect(() => {
//   if (isAuthenticated) {
//     navigate("/home");
//   }
// }, [isAuthenticated]);

  return (
    <div className="login-card">
      <div className="login-logo-container">
        <img src={logo} alt="BookMyVenue Logo" className="login-card-logo" />
      </div>

      <div className="login-header">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">
          Please enter your details to sign in
        </p>
      </div>

      {errorMsg && <div className="login-error-message">{errorMsg}</div>}

      <form className="login-form" onSubmit={(e) => { e.preventDefault(); console.log("FORM SUBMIT"); handleSubmit(); }}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-with-icon">
            <FiMail className="input-icon" />
            <input 
              type="email" 
              id="email" 
              name="email"
              placeholder="name@company.com" 
              className="form-input"
              onChange={hanldeChange}
            />
          </div>
        </div>

        <div className="form-group password-group">
          <div className="label-row">
            <label htmlFor="password">Password</label>
            <a href="#" className="forgot-password-link">Forgot password?</a>
          </div>
          <div className="input-with-icon">
            <FiLock className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              name="password"
              placeholder="••••••••" 
              className="form-input password-input"
              onChange={hanldeChange}
            />
            <button 
              type="button" 
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

      

        <button type="button" className="submit-btn" onClick={handleSubmit}>
          Sign In
          <FiArrowRight className="btn-arrow" />
        </button>
      </form>

      <div className="login-footer-links">
        <p>Don't have an account? <Link to="/register" className="form-link-highlight">Register now</Link></p>
      </div>
    </div>
  );
};

export default Login;
