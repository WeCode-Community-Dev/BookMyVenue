import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import api from '@/lib/axios'
import { ROLES } from "@/constants/Roles";
import { API_ROUTES } from "@/constants/apiRoutes"

import { ROUTES } from '@/constants/routes'

const ForgotPasswordForm = ({role}) => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD(role), { email })
            setSuccess(true)
        } catch (err) {
            console.log(err)
            setError(err.response?.data?.message || 'Something went wrong. Please try again.')
        } finally {
            
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Logo */}
            <div className="flex justify-center pt-12 pb-6">
                <div className="flex items-center gap-2">
                    <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg">
                        🏛️
                    </div>
                    <span className="font-bold text-xl text-slate-800">Book My Venue</span>
                </div>
            </div>

            {/* Card */}
            <div className="flex justify-center px-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">

                    {success ? (
                        /* Success state */
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Check your inbox</h2>
                            <p className="text-slate-500 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <Link
                                to={ROUTES.PUBLIC.LOGIN}
                                className="text-amber-500 font-medium hover:underline flex items-center justify-center gap-1"
                            >
                                <ArrowLeft size={16} />
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        /* Form state */
                        <>
                            <h1 className="text-2xl font-bold text-slate-800 mb-1">Forgot Password?</h1>
                            <p className="text-slate-500 text-sm mb-6">
                                No worries! Enter your email and we'll send you a reset link.
                            </p>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setError(null); setEmail(e.target.value) }}
                                            placeholder="you@example.com"
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>

                            <div className="mt-5 text-center">
                                <Link
                                    to={ROUTES.PUBLIC.LOGIN}
                                    className="text-sm text-amber-500 font-medium hover:underline flex items-center justify-center gap-1"
                                >
                                    <ArrowLeft size={14} />
                                    Back to Sign In
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Help footer */}
            <div className="mt-8 mx-4">
                <div className="max-w-md mx-auto bg-slate-50 rounded-xl p-4 text-center text-sm text-slate-500">
                    Need help? Contact our support team at{' '}
                    <a href="mailto:support@bookmyvenue.com" className="text-amber-500 hover:underline">
                        support@bookmyvenue.com
                    </a>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordForm
