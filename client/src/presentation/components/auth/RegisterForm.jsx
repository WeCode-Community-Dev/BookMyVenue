import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"

import { ROUTES } from '@/constants/routes'
import { registerSchema } from '@/lib/validation/authValidation'
import { ROLES } from '@/constants/Roles'
import { registerUser } from "@/redux/slices/authSlice"

const RegisterForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [role, setRole] = useState(ROLES.USER)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { loading } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }
        
    const handleSubmit = async (e) => {
        e.preventDefault()

        // 1. Client-side check: Match passwords
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        // 2. Schema validation (Zod)
        const validation = registerSchema.safeParse({
            ...formData,
            role,
        })

        if (!validation.success) {
            // Display the first validation error in a toast
            const errorMessage = validation.error.issues[0]?.message || 'Validation failed'
            toast.error(errorMessage)
            return
        }

        // 3. Dispatch to API
        const result = await dispatch(
            registerUser({
                role,
                userData: validation.data,
            })
        )

        // 4. Handle Redux response
        if (registerUser.fulfilled.match(result)) {
            toast.success("Account created successfully! Please verify your OTP.")
            navigate(ROUTES.PUBLIC.VERIFY_OTP, {
                state: {
                    email: formData.email,
                    role,
                },
            })
        } else if (registerUser.rejected.match(result)) {
            // Handle server rejection error message
            const apiError = result.payload?.message || result.error?.message || "Registration failed"
            toast.error(apiError)
            
        }
    }
      
    return (
        <div className="flex flex-col justify-center px-8 md:px-16 py-12">
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Create Account</h1>
            <p className="text-slate-500 mb-6">Join thousands of happy customers</p>

            {/* Role toggle */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => setRole(ROLES.USER)}
                    className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition ${role === ROLES.USER ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-slate-200 text-slate-500'}`}
                >
                    <User size={20} />
                    <span className="font-semibold text-sm">Customer</span>
                    <span className="text-xs text-slate-400">Book venues</span>
                </button>
                <button
                    type="button"
                    onClick={() => setRole(ROLES.VENDOR)}
                    className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition ${role === ROLES.VENDOR ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-slate-200 text-slate-500'}`}
                >
                    <span className="text-xl">🏛️</span>
                    <span className="font-semibold text-sm">Venue Owner</span>
                    <span className="text-xs text-slate-400">List venues</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" required
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" required
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Create a strong password" required
                            className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat your password" required
                            className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={loading}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-60">
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link to={ROUTES.PUBLIC.LOGIN} className="text-amber-500 font-medium hover:underline">Sign in</Link>
            </p>
        </div>
    )
}

export default RegisterForm