import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/authContext.js';

// Customer Google login popup
export function LoginModal() {
  const { loginOpen, closeLogin, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');

  if (!loginOpen) return null;

  async function handleSuccess(credentialResponse) {
    setError('');
    try {
      // credentialResponse.credential is the Google ID token (a JWT).
      // loginWithGoogle closes this modal on success.
      await loginWithGoogle(credentialResponse.credential);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLogin();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="font-semibold text-gray-900">Login to BookMyVenue</h2>
          <button
            onClick={closeLogin}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center gap-6 p-6">

          <p className="text-sm text-gray-500">
            Login to discover and book venues.
          </p>

          <GoogleLogin
            text="continue_with"
            onSuccess={handleSuccess}
            onError={() => setError('Google login was cancelled or failed.')}
          />

          {error && <p className="text-center text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
