import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { login } from "@/redux/slices/AuthSlice"
import { ROUTES } from '@/constants/routes'
import { ROLES } from "@/constants/Roles"
import toast from "react-hot-toast"

const AdminLoginForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    
    const { loading, error } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }   

    const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        const result = await dispatch(
            login({
                role: ROLES.ADMIN,
                data: formData,
            })
        ).unwrap()

        console.log("UNWRAPPED RESULT OBJECT:", result)

        // 1. Check if 'admin' object exists in response data, or read role directly
        const loggedInRole = 
            result?.admin?.role || 
            (result?.data?.admin ? ROLES.ADMIN : undefined) || 
            result?.data?.role || 
            result?.role;

        // 2. Validate role against ROLES enum
        if (loggedInRole === ROLES.ADMIN) {
            toast.success("Admin login successful!");
            navigate("/admin/dashboard");
        } else {
            toast.error("Access denied: You are not an admin!");
            navigate(ROUTES.ADMIN.LOGIN);
        }

    } catch (err) {
        console.error("Admin Login failed:", err)
        toast.error(err?.message || err || "Invalid email or password")
    }
}

    return (
        <div className="flex flex-col justify-center px-8 md:px-16 py-16">
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Admin Login</h1>
            <p className="text-slate-500 mb-8">Sign in to access the admin dashboard</p>

            {/* Error Banner */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@example.com"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Sign In Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? 'Signing in...' : 'Sign In as Admin'}
                </button>
            </form>
        </div>
    )
}

export default AdminLoginForm