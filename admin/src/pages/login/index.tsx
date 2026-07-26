import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import bmvLogo from "@/assets/bmv-logo.png";

import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/useApi";
import { API_ENDPOINTS } from "@/constants";
import { ROUTES } from "@/constants/routes";
import { queryClient } from "@/config/queryClient";
import { QUERY_KEYS } from "@/config/queryKeys";
import { getSafeRedirectUrl } from "@/utils/redirect";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending, error } = useApiMutation(
    {
      method: "POST",
      url: API_ENDPOINTS.LOGIN,
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.PROFILE,
        });

        const localRedirect = localStorage.getItem("redirectUrl");
        let finalRedirect: string = ROUTES.DASHBOARD;

        if (redirectParam && localRedirect && redirectParam === localRedirect) {
          finalRedirect = getSafeRedirectUrl(redirectParam, ROUTES.DASHBOARD);
        } else if (redirectParam) {
          finalRedirect = getSafeRedirectUrl(redirectParam, ROUTES.DASHBOARD);
        } else if (localRedirect) {
          finalRedirect = getSafeRedirectUrl(localRedirect, ROUTES.DASHBOARD);
        }

        try {
          localStorage.removeItem("redirectUrl");
        } catch {
          // Ignore localStorage errors
        }

        navigate(finalRedirect);
      },
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10">
        {/* Left Side */}
        <div className="hidden flex-1 lg:flex flex-col justify-center pr-20">
          <div className="mb-10">
            <img src={bmvLogo} alt="BookMyVenue" className="h-20 w-auto" />
          </div>

          <p className="mt-6 max-w-md text-xl leading-8 text-zinc-600">
            Manage your properties, bookings, customers and business from one
            powerful dashboard.
          </p>

          <div className="mt-12 space-y-5">
            {[
              "Manage multiple venues",
              "Track bookings in real time",
              "Customer & event management",
              "Powerful analytics dashboard",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-zinc-700">
                <div className="h-2.5 w-2.5 rounded-full bg-black" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 flex justify-center lg:hidden">
              <img src={bmvLogo} alt="BookMyVenue" className="h-14 w-auto" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              Welcome Back 👋
            </h2>

            <p className="mt-2 text-zinc-500">
              Sign in to continue to your dashboard.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Email Address
                </label>

                <div className="flex items-center rounded-xl border border-zinc-300 bg-white px-4 transition-all focus-within:border-black focus-within:ring-4 focus-within:ring-zinc-100">
                  <Mail className="mr-3 h-5 w-5 text-zinc-400" />

                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full bg-transparent outline-none placeholder:text-zinc-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-zinc-300 bg-white px-4 transition-all focus-within:border-black focus-within:ring-4 focus-within:ring-zinc-100">
                  <Lock className="mr-3 h-5 w-5 text-zinc-400" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 w-full bg-transparent outline-none placeholder:text-zinc-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-400 transition hover:text-zinc-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-zinc-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="font-medium text-zinc-600 transition hover:text-black"
                >
                  Forgot password?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-600">{error.message}</p>
                </div>
              )}

              {/* Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="mt-3 h-12 w-full rounded-xl bg-black text-base font-medium shadow-lg transition-all hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-xl active:translate-y-0 disabled:pointer-events-none"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

                {isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
              © {new Date().getFullYear()} BookMyVenue
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
