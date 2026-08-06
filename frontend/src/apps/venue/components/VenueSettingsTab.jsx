import { useState } from "react"
import { Power, PowerOff } from "lucide-react"
import { motion } from "framer-motion"
import { parseVenueError, updateVenueActiveStatus } from "@/apis/venues"

export default function VenueSettingsTab({ venue, onVenueUpdate }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const isActive = venue?.is_active ?? true

  const handleToggle = async () => {
    if (!venue?.slug) return

    const nextValue = !isActive
    setSaving(true)
    setError("")
    setSuccessMessage("")

    try {
      const updated = await updateVenueActiveStatus(venue.slug, nextValue)
      onVenueUpdate?.(updated)
      setSuccessMessage(
        nextValue
          ? "Venue is now accepting bookings."
          : "Venue is now paused and not accepting bookings.",
      )
      window.setTimeout(() => setSuccessMessage(""), 4000)
    } catch (err) {
      setError(parseVenueError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {successMessage && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {isActive ? <Power size={22} /> : <PowerOff size={22} />}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Booking availability
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isActive
                  ? "Your venue is live and customers can discover it and make bookings."
                  : "Your venue is paused. It will be hidden from search and customers cannot make new bookings."}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Existing bookings are not affected. You can turn bookings back on at any time.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            aria-label={isActive ? "Venue is accepting bookings" : "Venue is not accepting bookings"}
            disabled={saving}
            onClick={handleToggle}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              isActive ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div
          className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
            isActive
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          <span className="font-semibold">
            {isActive ? "Active" : "Inactive"}
          </span>
          {" — "}
          {isActive
            ? "New bookings are allowed."
            : "New bookings are blocked."}
        </div>
      </motion.section>
    </div>
  )
}
