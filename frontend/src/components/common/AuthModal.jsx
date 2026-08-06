import { useEffect, useState } from "react"
import { GoogleLogin } from "@react-oauth/google"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Phone, X } from "lucide-react"
import {
  loginUser,
  loginWithGoogle,
  parseAuthError,
  registerUser,
  resendSignupOtpUser,
  verifySignupOtpUser,
} from "../../apis/auth"
import { useAuth } from "../../contexts/AuthContext"
import SignupOtpVerification from "./SignupOtpVerification"

const methods = [
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
]

export default function AuthModal({ open, onClose, onSuccess, message }) {
  const { login } = useAuth()
  const [mode, setMode] = useState("login")
  const [method, setMethod] = useState("email")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [googleError, setGoogleError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [registerStep, setRegisterStep] = useState("details")
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0)
  const [resendingOtp, setResendingOtp] = useState(false)

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setMode("login")
      setMethod("email")
      setFullName("")
      setEmail("")
      setPassword("")
      setError("")
      setGoogleError("")
      setSubmitting(false)
      setGoogleLoading(false)
      setRegisterStep("details")
      setResendCooldownSeconds(0)
      setResendingOtp(false)
    }
  }, [open])

  const completeAuth = (data) => {
    login(data)
    onSuccess?.()
  }

  const handleEmailSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      if (mode === "login") {
        const data = await loginUser({ email, password })
        completeAuth(data)
        return
      }

      const data = await registerUser({
        email,
        password,
        full_name: fullName || undefined,
      })
      setResendCooldownSeconds(data.resend_cooldown_seconds ?? 0)
      setRegisterStep("verify")
    } catch (err) {
      setError(parseAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerifyOtp = async (otp) => {
    setError("")
    setSubmitting(true)

    try {
      const data = await verifySignupOtpUser({ email, otp })
      completeAuth(data)
    } catch (err) {
      setError(parseAuthError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    setError("")
    setResendingOtp(true)

    try {
      const data = await resendSignupOtpUser({ email })
      setResendCooldownSeconds(data.resend_cooldown_seconds ?? 0)
      return data.resend_cooldown_seconds ?? 0
    } catch (err) {
      setError(parseAuthError(err))
      return 0
    } finally {
      setResendingOtp(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential
    if (!idToken) {
      setGoogleError("Google sign-in did not return a token.")
      return
    }

    setGoogleLoading(true)
    setGoogleError("")

    try {
      const data = await loginWithGoogle(idToken)
      completeAuth(data)
    } catch {
      setGoogleError("Google sign-in failed. Please try again.")
    } finally {
      setGoogleLoading(false)
    }
  }

  const toggleMode = () => {
    setMode((current) => (current === "login" ? "register" : "login"))
    setRegisterStep("details")
    setError("")
    setPassword("")
  }

  const showingOtpStep = mode === "register" && registerStep === "verify"

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close sign in dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[2rem] border border-border bg-card shadow-[0_24px_60px_rgba(27,36,29,0.18)]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-7 sm:p-8">
              <span className="text-sm font-semibold uppercase tracking-wider text-accent">
                {mode === "login" ? "Welcome back" : "Get started"}
              </span>
              <h2
                id="auth-modal-title"
                className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground"
              >
                {showingOtpStep
                  ? "Verify your email"
                  : mode === "login"
                    ? "Sign in to BookMyVenue"
                    : "Create your account"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {showingOtpStep
                  ? "Enter the verification code we sent to your email to finish creating your account."
                  : message ||
                    (mode === "login"
                      ? "Sign in to book venues and manage your reservations."
                      : "Create an account to book venues and track your bookings.")}
              </p>

              {!showingOtpStep && (
                <>
              <div className="mt-6 flex w-full justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    setGoogleError("Google sign-in was cancelled or failed.")
                  }
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="360"
                  useOneTap={false}
                />
              </div>

              {googleLoading && (
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Signing you in...
                </p>
              )}

              {googleError && (
                <p className="mt-2 text-center text-sm text-red-600">
                  {googleError}
                </p>
              )}

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  or
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {methods.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMethod(item.id)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                      method === item.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
                </>
              )}

              {showingOtpStep ? (
                <SignupOtpVerification
                  email={email}
                  initialCooldownSeconds={resendCooldownSeconds}
                  onVerify={handleVerifyOtp}
                  onResend={handleResendOtp}
                  onBack={() => {
                    setRegisterStep("details")
                    setError("")
                  }}
                  verifying={submitting}
                  resending={resendingOtp}
                  error={error}
                />
              ) : method === "phone" ? (
                <div className="mt-5 rounded-xl border border-border bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
                  Phone sign-in is coming soon. Please use email for now.
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="mt-5 space-y-4">
                  {mode === "register" && (
                    <div>
                      <label
                        htmlFor="auth-full-name"
                        className="text-sm font-medium text-foreground"
                      >
                        Full name
                      </label>
                      <input
                        id="auth-full-name"
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Your name"
                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        autoComplete="name"
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="auth-email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email address
                    </label>
                    <input
                      id="auth-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      required
                      className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="auth-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </label>
                    <input
                      id="auth-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={mode === "login" ? "Your password" : "Create a password"}
                      required
                      minLength={8}
                      className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? mode === "login"
                        ? "Signing in..."
                        : "Sending verification code..."
                      : mode === "login"
                        ? "Sign in with email"
                        : "Continue"}
                  </button>
                </form>
              )}

              <p className="mt-5 text-center text-sm text-muted-foreground">
                {showingOtpStep
                  ? "Wrong email?"
                  : mode === "login"
                    ? "New to BookMyVenue?"
                    : "Already have an account?"}
                <button
                  type="button"
                  onClick={showingOtpStep ? () => setRegisterStep("details") : toggleMode}
                  className="ml-2 font-semibold text-primary hover:underline"
                >
                  {showingOtpStep
                    ? "Edit signup details"
                    : mode === "login"
                      ? "Create account"
                      : "Sign in"}
                </button>
              </p>

              <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
