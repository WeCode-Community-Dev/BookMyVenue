import { useState } from 'react';

function Register({ onRegisterSuccess, onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // // Front-end validations
    // if (!name || !email || !password || !role) {
    //   setError('Please fill in all required fields.');
    //   return;
    // }

    // if (password.length < 6) {
    //   setError('Password must be at least 6 characters long.');
    //   return;
    // }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          location: location || null, // send null if empty
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.message ||
          Object.values(errorData).join(", ") ||
          "Registration failed"
        );
      }

      const data = await response.json(); // AuthResponse: { token, email, name, role }
      setSuccess(true);
      
      // Auto login after a short delay for nice UX
      setTimeout(() => {
        onRegisterSuccess(data);
      }, 1500);

    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      <p className="auth-subtitle">Join us to start booking venues or hosting your own!</p>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">Account created successfully! Logging you in...</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            placeholder=""
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={success}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={success}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">I want to *</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled={success}
          >
            <option value="user">Book venues (User)</option>
            <option value="owner">Host venues (Owner)</option>
            {/* <option value="admin">Administrator</option> */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location (City, Country)</label>
          <input
            type="text"
            id="location"
            placeholder="Kochi (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={success}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password * (Min 8 characters)</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={success}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={success}
          />
        </div>

        <button type="submit" className="auth-button" disabled={loading || success}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account?{' '}
        <button
          type="button"
          className="link-button"
          onClick={() => onNavigate('login')}
          disabled={success}
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

export default Register;
