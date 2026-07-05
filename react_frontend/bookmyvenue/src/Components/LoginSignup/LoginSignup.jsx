import React from 'react'
import LoginSignupImage from '../Assets/LoginSignup.jpeg'
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import '../Header/header.css'

export const LoginSignup = ({ action = { signUp: "Sign Up", text: "Create your account" } }) => {
     
  return (
    <div className="signup-page">
      <main className="signup-container">
        <section className="signup-left">
          <img
            src={LoginSignupImage}
            alt="Venue event"
            className="hero-image"
          />

          <div className="location-line">
            <span>📍</span>
            <p>Find & Book the Perfect Space Near You</p>
          </div>

          <h2>Create your BookMyVenue account</h2>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">📍</div>
              <p>Find local venues near you</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">♥</div>
              <p>Save favourite venues</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">➤</div>
              <p>Send and track booking requests</p>
            </div>
          </div>
        </section>
        {/* signup/Login starting */}
        <section className="signup-card">
          <div className="form-header">
            <h2>{action.signUp}</h2>
            <p>{action.text}</p>
          </div>
          {/* form startin */}
            {action.signUp ==='Sign Up' ? (<SignUpForm/>):(<LoginForm/>)}
          {/* form ending */}
          
        </section>
        {/* signup/Login ending */}
      </main>
    </div>
  )
}
export default LoginSignup;
