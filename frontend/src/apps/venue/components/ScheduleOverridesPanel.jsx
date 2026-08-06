import { useMemo, useState } from "react"
import {
  CalendarOff,
  Plus,
  Trash2,
  Pencil,
  Ban,
  Save,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  overrideFromApi,
  parseScheduleGroupError,
} from "@/apis/venueSchedules"
import { useVenueScheduleOverrides } from "@/apps/venue/hooks/useVenueScheduleOverrides"
import {
  OVERRIDE_BOOKING_TYPE_HINTS,
  buildScheduleOverridePayload,
  createScheduleOverride,
  formatOverrideDate,
  formatOverrideTimeRange,
  validateOverrideAgainstExisting,
} from "@/apps/venue/utils/scheduleOverrides"

const EMPTY_FORM = {
  overrideDate: "",
  isFullDay: true,
  startTime: "09:00",
  endTime: "18:00",
  reason: "",
}

function OverrideRow({ override, onEdit, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-white px-4 py-3"
    >
      <div className="min-w-0">
        <p className="font-semibold text-foreground">
          {formatOverrideDate(override.override_date)}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
            <Ban size={12} />
            Unavailable
          </span>
          <span>{formatOverrideTimeRange(override)}</span>
        </p>
        {override.reason && (
          <p className="mt-1 text-sm text-foreground/80">{override.reason}</p>
        )}
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => onEdit(override)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          title="Edit block"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(override.id)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 cursor-pointer"
          title="Remove block"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  )
}

export default function ScheduleOverridesPanel({ venue, bookingType }) {
  const {
    overrides,
    setOverrides,
    loading,
    loadError,
    persistOverride,
    removeOverride,
  } = useVenueScheduleOverrides(venue)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingOverrideId, setEditingOverrideId] = useState(null)
  const [formError, setFormError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [saving, setSaving] = useState(false)

  const sortedOverrides = useMemo(
    () =>
      [...overrides].sort((a, b) =>
        a.override_date.localeCompare(b.override_date),
      ),
    [overrides],
  )

  const hint =
    OVERRIDE_BOOKING_TYPE_HINTS[bookingType] ??
    OVERRIDE_BOOKING_TYPE_HINTS.hourly

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingOverrideId(null)
    setFormError("")
  }

  const handleSubmit = async () => {
    setFormError("")
    setSuccessMessage("")

    try {
      const override = createScheduleOverride({
        overrideDate: form.overrideDate,
        isFullDay: form.isFullDay,
        startTime: form.startTime,
        endTime: form.endTime,
        reason: form.reason,
        id: editingOverrideId ?? undefined,
      })

      validateOverrideAgainstExisting(
        override,
        overrides,
        editingOverrideId,
      )

      setSaving(true)
      const payload = buildScheduleOverridePayload(override)
      const saved = await persistOverride(payload, editingOverrideId)
      const mapped = overrideFromApi(saved)

      setOverrides((prev) => {
        if (editingOverrideId) {
          return prev.map((item) =>
            item.id === editingOverrideId ? mapped : item,
          )
        }
        return [...prev, mapped]
      })

      setSuccessMessage(
        editingOverrideId
          ? "Date block updated."
          : "Date block added. It will override the regular schedule for that day.",
      )
      resetForm()
      window.setTimeout(() => setSuccessMessage(""), 4000)
    } catch (error) {
      setFormError(parseScheduleGroupError(error))
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (override) => {
    setEditingOverrideId(override.id)
    setForm({
      overrideDate: override.override_date,
      isFullDay: override.isFullDay,
      startTime: override.start_time ?? "09:00",
      endTime: override.end_time ?? "18:00",
      reason: override.reason ?? "",
    })
    setFormError("")
    setSuccessMessage("")
  }

  const handleDelete = async (overrideId) => {
    setFormError("")
    try {
      await removeOverride(overrideId)
      if (editingOverrideId === overrideId) resetForm()
    } catch (error) {
      setFormError(parseScheduleGroupError(error))
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  if (loading) {
    return (
      <section className="rounded-2xl border border-border/60 bg-white/70 px-6 py-16 text-center shadow-sm backdrop-blur-sm animate-pulse">
        <p className="text-sm text-muted-foreground">Loading blocked dates...</p>
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="rounded-xl bg-accent/10 p-2 text-accent">
          <CalendarOff size={20} />
        </div>
        <div>
          <h2 className="font-semibold text-lg text-foreground">Block Dates</h2>
          <p className="text-xs text-muted-foreground">
            {venue?.name
              ? `Override availability for ${venue.name}`
              : "Mark dates or time ranges as unavailable"}
          </p>
        </div>
      </div>

      {loadError && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </p>
      )}

      <p className="mb-6 rounded-xl bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        {hint}
      </p>

      {successMessage && (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
            Date
          </label>
          <input
            type="date"
            min={today}
            className="input"
            value={form.overrideDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, overrideDate: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
            Reason
          </label>
          <input
            type="text"
            className="input"
            placeholder="e.g., Maintenance"
            value={form.reason}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, reason: e.target.value }))
            }
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-white px-4 py-3">
            <input
              type="checkbox"
              className="accent-primary"
              checked={form.isFullDay}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isFullDay: e.target.checked,
                }))
              }
            />
            <span className="text-sm font-medium text-foreground">
              Block entire day
            </span>
          </label>
        </div>

        {!form.isFullDay && (
          <>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                Start Time
              </label>
              <input
                type="time"
                className="input"
                value={form.startTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startTime: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                End Time
              </label>
              <input
                type="time"
                className="input"
                value={form.endTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, endTime: e.target.value }))
                }
              />
            </div>
          </>
        )}
      </div>

      {formError && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="btn btn-primary inline-flex items-center gap-2 cursor-pointer"
        >
          {editingOverrideId ? <Save size={16} /> : <Plus size={16} />}
          {saving
            ? "Saving..."
            : editingOverrideId
              ? "Update Block"
              : "Add Block"}
        </button>
        {editingOverrideId && (
          <button
            type="button"
            onClick={resetForm}
            className="btn btn-outline cursor-pointer"
          >
            Cancel edit
          </button>
        )}
      </div>

      <div className="mt-8 border-t border-border/40 pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-semibold text-foreground">Blocked dates</h3>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
            {sortedOverrides.length} block{sortedOverrides.length === 1 ? "" : "s"}
          </span>
        </div>

        {sortedOverrides.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center">
            <CalendarOff size={24} className="mx-auto text-muted-foreground/60" />
            <p className="mt-2 text-sm font-medium text-foreground">
              No blocked dates yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add a date block for maintenance, holidays, or private events.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {sortedOverrides.map((override) => (
                <OverrideRow
                  key={override.id}
                  override={override}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {sortedOverrides.length > 0 && (
          <p className="mt-4 text-xs text-muted-foreground">
            These blocks override the weekly schedule on the selected dates.
          </p>
        )}
      </div>
    </section>
  )
}
