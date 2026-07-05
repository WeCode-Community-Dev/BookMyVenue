import { useState } from 'react';

function Login({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        
        const errorText = await response.text();
        throw new Error(errorText || 'Invalid email or password');
      }

      const data = await response.json(); // AuthResponse: { token, email, name, role }
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Sign In</h2>
      <p className="auth-subtitle">Welcome back! Please enter your details.</p>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account?{' '}
        <button
          type="button"
          className="link-button"
          onClick={() => onNavigate('register')}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}

export default Login;
