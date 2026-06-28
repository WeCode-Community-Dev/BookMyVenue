import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Register.css';

export default function Register() {
  const [role, setRole] = useState('customer'); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); 

    
    if (role === 'customer') {
      navigate('/'); 
    } else if (role === 'host') {
      navigate('/host'); 
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join our premium venue community today.</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          
          <label className="input-label">I am joining as a...</label>
          <div className="role-selector">
            <div 
              className={`role-box ${role === 'customer' ? 'active' : ''}`}
              onClick={() => setRole('customer')}
            >
              <span className="role-icon">👤</span>
              <div>
                <h4>Customer</h4>
                <p>I want to book a venue</p>
              </div>
            </div>

            <div 
              className={`role-box ${role === 'host' ? 'active' : ''}`}
              onClick={() => setRole('host')}
            >
              <span className="role-icon">🏨</span>
              <div>
                <h4>Host</h4>
                <p>I want to host my venue</p>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <span className="field-icon">👤</span>
              <input type="text" placeholder="Jane Doe" required />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="field-icon">✉️</span>
              <input type="email" placeholder="jane@example.com" required />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="field-icon">🔒</span>
              <input type="password" placeholder="••••••••" required />
            </div>
          </div>

          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              By signing up, I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
            </label>
          </div>

          <button type="submit" className="btn-submit">Create Account</button>

          <div className="divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="btn-social">
              <span className="social-icon">🌐</span> Google
            </button>
            <button type="button" className="btn-social">
              <span className="social-icon">🍎</span> Apple
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}