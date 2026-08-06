import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"

const OTP_LENGTH = 6

export default function SignupOtpVerification({
  email,
  initialCooldownSeconds = 0,
  onVerify,
  onResend,
  onBack,
  verifying = false,
  resending = false,
  error = "",
}) {
  const [otp, setOtp] = useState("")
  const [cooldownSeconds, setCooldownSeconds] = useState(initialCooldownSeconds)

  useEffect(() => {
    setCooldownSeconds(initialCooldownSeconds)
  }, [initialCooldownSeconds])

  useEffect(() => {
    if (cooldownSeconds <= 0) return undefined

    const timer = window.setInterval(() => {
      setCooldownSeconds((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [cooldownSeconds])

  const handleOtpChange = (event) => {
    const nextValue = event.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH)
    setOtp(nextValue)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (otp.length !== OTP_LENGTH) return
    await onVerify(otp)
  }

  const handleResend = async () => {
    if (cooldownSeconds > 0 || resending) return
    const nextCooldown = await onResend()
    if (typeof nextCooldown === "number" && nextCooldown > 0) {
      setCooldownSeconds(nextCooldown)
    }
  }

  return (
    <div className="mt-5 space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to signup details
      </button>

      <div className="rounded-xl border border-border bg-muted/30 px-4 py-4">
        <p className="text-sm text-muted-foreground">
          We sent a {OTP_LENGTH}-digit verification code to
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="signup-otp"
            className="text-sm font-medium text-foreground"
          >
            Verification code
          </label>
          <input
            id="signup-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            onChange={handleOtpChange}
            placeholder={"0".repeat(OTP_LENGTH)}
            required
            maxLength={OTP_LENGTH}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-lg tracking-[0.35em] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={verifying || otp.length !== OTP_LENGTH}
          className="w-full rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {verifying ? "Verifying..." : "Verify and create account"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t receive the code?
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldownSeconds > 0 || resending}
          className="ml-2 font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
        >
          {resending
            ? "Resending..."
            : cooldownSeconds > 0
              ? `Resend in ${cooldownSeconds}s`
              : "Resend code"}
        </button>
      </p>
    </div>
  )
}
