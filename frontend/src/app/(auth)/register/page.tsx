'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      // Create user on backend
      await api.post('/users', {
        name,
        phoneNumber,
        email,
        password,
        role,
      });

      if (role === 'Admin') {
        setSuccess(true);
        setName('');
        setPhoneNumber('');
        setEmail('');
        setPassword('');
        setRole('User');
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      const msg = err.response?.data?.message || 'Something went wrong. Please check your inputs and try again.';
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950 -z-10 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block text-3xl font-extrabold text-white tracking-tight">
          BookMy<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Venue</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Or{' '}
          <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/5 backdrop-blur-md py-8 px-4 shadow-2xl border border-white/10 sm:rounded-2xl sm:px-10">
          {success ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Registration Successful!</h3>
                <div className="mt-4 p-4 rounded-xl bg-amber-950/40 border border-amber-500/20 text-amber-300 text-sm text-left leading-relaxed space-y-2">
                  <p className="font-semibold text-amber-200">⏳ Profile Status: Pending Approval</p>
                  <p>
                    Your account has been created successfully. To ensure community safety, all new profiles must be reviewed and activated by an administrator.
                  </p>
                  <p className="font-light">
                    You will not be able to log in until an admin changes your status to <strong>Active</strong>.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="appearance-none block w-full px-3 py-3 border border-white/10 rounded-xl shadow-sm placeholder-slate-500 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="appearance-none block w-full px-3 py-3 border border-white/10 rounded-xl shadow-sm placeholder-slate-500 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="appearance-none block w-full px-3 py-3 border border-white/10 rounded-xl shadow-sm placeholder-slate-500 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="appearance-none block w-full px-3 py-3 border border-white/10 rounded-xl shadow-sm placeholder-slate-500 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-300">
                  I want to...
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="block w-full px-3 py-3 border border-white/10 rounded-xl shadow-sm bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all cursor-pointer"
                  >
                    <option value="User">Book Venues (User)</option>
                    <option value="Venue owner">List & Manage Venues (Owner)</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}