import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { InputWithIcon } from "../../components/shared/form/InputWithIcon.jsx";
import { PasswordField } from "../../components/shared/form/PasswordField.jsx";
import { EMAIL_PATTERN } from "../../components/shared/form/inputClasses.js";
import bmvLogo from "../../assets/bmvLogo.svg";
import { api } from "../../api/client.js";
import { showInfo } from "../../utils/toastBus.js";
import { useAuth } from "../../context/authContext.js";

export function AdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { user, loading, loginWithSession } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Wait for the initial token check before deciding what to show, so a hard
    // refresh on /admin doesn't flash the login form before redirecting.
    if (loading) return null;

    // Already logged in as an admin — skip the login page.
    if (user?.role === "admin") {
        return <Navigate to="/admin/home" replace />;
    }

    async function onSubmit(data) {
        try {
            const res = await api.post("/auth/login", data);
            loginWithSession(res.data.token, res.data.user);
            navigate("/admin/home");
        } catch (error) {
            // error is already shown by the toast from the API client
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
                    <div className="mb-6 text-center">
                        <img
                            src={bmvLogo}
                            alt="BookMyVenue"
                            className="mx-auto mb-4 h-14 w-14"
                        />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Admin Login
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                        <InputWithIcon
                            id="admin-email"
                            label="Email"
                            icon={Mail}
                            type="email"
                            placeholder="you@bmv.com"
                            error={errors.email}
                            registration={register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: EMAIL_PATTERN,
                                    message: "Enter a valid email address",
                                },
                            })}
                        />

                        <PasswordField
                            id="admin-password"
                            label="Password"
                            placeholder="Enter your password"
                            show={showPassword}
                            onToggle={() => setShowPassword((s) => !s)}
                            error={errors.password}
                            registration={register("password", {
                                required: "Password is required",
                            })}
                        />

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-red-600 py-3 text-white transition hover:bg-red-700"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
