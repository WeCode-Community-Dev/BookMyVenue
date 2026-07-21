import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiHome, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import './register.scss';
import { useRegisterMutation } from '../authApi.js';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [role, setRole] = useState('user'); // 'booker' or 'owner'
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
  username: "",
  email: "",
  password: "",
});

const navigate = useNavigate();

const [register, {
    data,
    error,
    isLoading,
    isSuccess,
    isError,
  }] = useRegisterMutation();

  console.log(isSuccess, data, error,"sssssssss");

const handleInputChange = (e) => {
  const {name,value} = e.target;
  setFormData(prev => ({...prev, [name]: value}));
}

  const handleSubmit = async() => {
    if (!agreed) {
      alert("You must agree to the terms and privacy policy.");
      return;
    }
    console.log("Form submitted with data:", { ...formData, role });
   try {await register({ ...formData, role }).unwrap();
      navigate('/login');
  }catch(err){
    console.error("Registration failed:", err);
   }
    

  }

  return (
    <div className="register-card">
      <div className="register-header">
        <h1>Create your account</h1>
        <p className="register-subtitle">
          Join the premier marketplace for exceptional event spaces
        </p>
      </div>

      <div className="role-selector-section">
        <label className="section-label">I WANT TO JOIN AS...</label>
        <div className="role-cards-row">
          <div 
            className={`role-card ${role === 'user' ? 'active' : ''}`}
            onClick={() => setRole('user')}
          >
            <div className="role-icon-wrapper booker-icon">
              <FiCalendar className="role-icon" />
            </div>
            <div className="role-card-text">
              <h3>I want to book a venue</h3>
              <p>Discover and book spaces for weddings, parties, and meetings.</p>
            </div>
            <div className="role-indicator">
              <span className="indicator-dot"></span>
            </div>
          </div>

          <div 
            className={`role-card ${role === 'owner' ? 'active' : ''}`}
            onClick={() => setRole('owner')}
          >
            <div className="role-icon-wrapper owner-icon">
              <FiHome className="role-icon" />
            </div>
            <div className="role-card-text">
              <h3>I own a venue</h3>
              <p>List your property and manage bookings with professional tools.</p>
            </div>
            <div className="role-indicator">
              <span className="indicator-dot"></span>
            </div>
          </div>
        </div>
      </div>

      <form className="register-form" onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
        <div className="form-group">
          <label htmlFor="fullName">FULL NAME</label>
          <input 
            type="text" 
            id="fullName" 
            placeholder="John Doe" 
            className="form-input"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">EMAIL ADDRESS</label>
          <input 
            type="email" 
            id="email" 
            placeholder="john@example.com" 
            className="form-input"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group password-group">
          <label htmlFor="password">PASSWORD</label>
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              placeholder="••••••••" 
              className="form-input password-input"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
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
          <span className="form-hint">Must be at least 8 characters long.</span>
        </div>

        <div className="form-checkbox-group">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
            <span className="checkmark"></span>
            <span className="checkbox-label">
              I agree to the <a href="#" className="form-link">Terms of Service</a> and <a href="#" className="form-link">Privacy Policy</a>. I also consent to receive updates regarding my account.
            </span>
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Create Account
          <FiArrowRight className="btn-arrow" />
        </button>
      </form>

      <div className="register-footer-links">
        <p>Already have an account? <Link to="/login" className="form-link-highlight">Log in</Link></p>
      </div>
    </div>
  );
};

export default Register;
