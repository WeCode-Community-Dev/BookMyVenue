import { useMemo, useState } from "react"
import {
  CalendarClock,
  Plus,
  Sparkles,
  Save,
  Trash2,
  Pencil,
  Ban,
  CheckCircle2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  hourlyGroupFromApi,
  parseScheduleGroupError,
} from "@/apis/venueSchedules"
import { useVenueScheduleGroups } from "@/apps/venue/hooks/useVenueScheduleGroups"
import {
  WEEKDAYS,
  formatDaySelection,
  getAvailableWeekdays,
  getAssignedDays,
  formatIndianPrice,
  formatCompactSlotRange,
  formatSlotName,
  generateHourlySlots,
  buildScheduleGroupPayload,
} from "@/apps/venue/utils/hourlySlots"

const EMPTY_DRAFT = {
  name: "",
  days: [],
  openTime: "07:00",
  closeTime: "22:00",
  durationMinutes: "60",
  defaultPrice: "500",
  slots: [],
}

function SlotRow({ slot, onPriceChange, onToggleAvailability }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
        slot.is_available
          ? "border-border/60 bg-white"
          : "border-border/40 bg-muted/30 opacity-70"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-semibold ${
            slot.is_available ? "text-foreground" : "text-muted-foreground line-through"
          }`}
        >
          {formatSlotName(slot.start_time, slot.end_time)}
        </p>
        {!slot.is_available && (
          <p className="text-[11px] font-medium text-accent">Unavailable</p>
        )}
      </div>

      <div className="relative w-28 shrink-0">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          ₹
        </span>
        <input
          type="number"
          min="0"
          step="1"
          className="input py-2 pl-7 pr-2 text-sm"
          value={slot.price}
          disabled={!slot.is_available}
          onChange={(e) => onPriceChange(slot.id, e.target.value)}
        />
      </div>

      <button
        type="button"
        title={slot.is_available ? "Mark unavailable" : "Mark available"}
        onClick={() => onToggleAvailability(slot.id)}
        className={`rounded-lg p-2 transition-colors cursor-pointer ${
          slot.is_available
            ? "text-muted-foreground hover:bg-muted hover:text-accent"
            : "bg-accent/10 text-accent hover:bg-accent/20"
        }`}
      >
        {slot.is_available ? <Ban size={16} /> : <CheckCircle2 size={16} />}
      </button>
    </div>
  )
}

export default function HourlySlotsTab({ venue }) {
  const {
    groups,
    setGroups,
    loading,
    loadError,
    persistGroup,
    removeGroup,
  } = useVenueScheduleGroups({
    venue,
    mapGroupFromApi: hourlyGroupFromApi,
  })
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [generateError, setGenerateError] = useState("")
  const [saveError, setSaveError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [saving, setSaving] = useState(false)

  const isEditingExisting = Boolean(editingGroupId)
  const hasGeneratedSlots = draft.slots.length > 0

  const sortedDraftSlots = useMemo(
    () =>
      [...draft.slots].sort(
        (a, b) => a.start_time.localeCompare(b.start_time),
      ),
    [draft.slots],
  )

  const availableDays = useMemo(
    () => getAvailableWeekdays(groups, editingGroupId),
    [groups, editingGroupId],
  )

  const assignedElsewhereLabels = useMemo(() => {
    const assigned = getAssignedDays(groups, editingGroupId)
    return [...assigned]
      .sort((a, b) => a - b)
      .map((day) => WEEKDAYS.find((item) => item.value === day)?.short ?? day)
  }, [groups, editingGroupId])

  const resetDraft = () => {
    setDraft(EMPTY_DRAFT)
    setEditingGroupId(null)
    setGenerateError("")
    setSaveError("")
  }

  const toggleDay = (dayValue) => {
    setDraft((prev) => ({
      ...prev,
      days: prev.days.includes(dayValue)
        ? prev.days.filter((day) => day !== dayValue)
        : [...prev.days, dayValue],
    }))
  }

  const handleGenerateSlots = () => {
    setGenerateError("")
    try {
      const slots = generateHourlySlots({
        openTime: draft.openTime,
        closeTime: draft.closeTime,
        durationMinutes: draft.durationMinutes,
        defaultPrice: draft.defaultPrice,
      })
      setDraft((prev) => ({ ...prev, slots }))
    } catch (error) {
      setGenerateError(error.message)
    }
  }

  const updateSlotPrice = (slotId, price) => {
    setDraft((prev) => ({
      ...prev,
      slots: prev.slots.map((slot) =>
        slot.id === slotId ? { ...slot, price } : slot,
      ),
    }))
  }

  const toggleSlotAvailability = (slotId) => {
    setDraft((prev) => ({
      ...prev,
      slots: prev.slots.map((slot) =>
        slot.id === slotId
          ? { ...slot, is_available: !slot.is_available }
          : slot,
      ),
    }))
  }

  const startEditGroup = (group) => {
    setEditingGroupId(group.id)
    setDraft({
      name: group.name,
      days: [...group.days],
      openTime: group.openTime ?? "07:00",
      closeTime: group.closeTime ?? "22:00",
      durationMinutes: group.durationMinutes ?? "60",
      defaultPrice: group.defaultPrice ?? "500",
      slots: group.slots.map((slot) => ({ ...slot })),
    })
    setGenerateError("")
    setSaveError("")
    setSuccessMessage("")
  }

  const handleSaveGroup = async () => {
    setSaveError("")
    setSuccessMessage("")

    if (!draft.name.trim()) {
      setSaveError("Please enter a schedule group name.")
      return
    }
    if (draft.days.length === 0) {
      setSaveError("Select at least one day for this schedule group.")
      return
    }
    if (draft.slots.length === 0) {
      setSaveError("Generate slots before saving this schedule group.")
      return
    }

    setSaving(true)

    try {
      const payload = buildScheduleGroupPayload({
        name: draft.name,
        days: draft.days,
        slots: draft.slots,
      })
      const saved = await persistGroup(payload, editingGroupId)
      const mapped = hourlyGroupFromApi(saved)

      setGroups((prev) => {
        const exists = prev.some((group) => group.id === mapped.id)
        if (exists) {
          return prev.map((group) =>
            group.id === mapped.id ? mapped : group,
          )
        }
        return [...prev, mapped]
      })

      setSuccessMessage(`"${mapped.name}" saved successfully.`)
      resetDraft()
      window.setTimeout(() => setSuccessMessage(""), 4000)
    } catch (error) {
      setSaveError(parseScheduleGroupError(error))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteGroup = async (groupId) => {
    setSaveError("")
    try {
      await removeGroup(groupId)
      if (editingGroupId === groupId) resetDraft()
    } catch (error) {
      setSaveError(parseScheduleGroupError(error))
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-white/70 px-6 py-16 text-center animate-pulse">
        <p className="text-sm text-muted-foreground">Loading schedule groups...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {loadError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </p>
      )}
      {successMessage && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Saved groups */}
        <section className="rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm backdrop-blur-sm xl:col-span-1">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-foreground">Schedule Groups</h2>
              <p className="text-xs text-muted-foreground">
                {venue?.name ? `For ${venue.name}` : "Configure weekly schedules"}
              </p>
            </div>
            {!isEditingExisting && (
              <button
                type="button"
                onClick={resetDraft}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground cursor-pointer"
              >
                <Plus size={14} />
                New
              </button>
            )}
          </div>

          {groups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center">
              <CalendarClock size={24} className="mx-auto text-muted-foreground/60" />
              <p className="mt-2 text-sm font-medium text-foreground">No groups yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create a weekday or weekend schedule to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {groups.map((group) => (
                  <motion.div
                    key={group.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className={`rounded-xl border p-4 transition-colors ${
                      editingGroupId === group.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/60 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">
                          {group.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatDaySelection(group.days)}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-primary">
                          {group.slots.filter((slot) => slot.is_available).length} active slots
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => startEditGroup(group)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                          title="Edit group"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(group.id)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 cursor-pointer"
                          title="Delete group"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Group editor */}
        <section className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-border/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-border/40 pb-4">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <CalendarClock size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">
                  {isEditingExisting ? "Edit Schedule Group" : "Create Schedule Group"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Name the group, pick days, generate hourly slots, then fine-tune prices.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                  Group Name
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Weekday Schedule"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                  Select Days
                </label>
                {availableDays.length === 0 ? (
                  <p className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                    All days are already assigned to other schedule groups. Edit or
                    delete an existing group to free up days.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                    {availableDays.map((day) => {
                      const checked = draft.days.includes(day.value)
                      return (
                        <label
                          key={day.value}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                            checked
                              ? "border-primary/30 bg-primary/5 text-primary"
                              : "border-border/60 bg-white hover:border-primary/20"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="accent-primary"
                            checked={checked}
                            onChange={() => toggleDay(day.value)}
                          />
                          <span className="font-medium">{day.short}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
                {assignedElsewhereLabels.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Already scheduled: {assignedElsewhereLabels.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-border/40 pb-4">
              <div className="rounded-xl bg-accent/10 p-2 text-accent">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">Generate Slots</h2>
                <p className="text-xs text-muted-foreground">
                  Set opening hours and slot duration. Slots are generated on the frontend.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                  Open Time
                </label>
                <input
                  type="time"
                  className="input"
                  value={draft.openTime}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, openTime: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                  Close Time
                </label>
                <input
                  type="time"
                  className="input"
                  value={draft.closeTime}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, closeTime: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                  Duration (min)
                </label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  className="input"
                  value={draft.durationMinutes}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      durationMinutes: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                  Default Price
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="input pl-8"
                    value={draft.defaultPrice}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        defaultPrice: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {generateError && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {generateError}
              </p>
            )}

            <button
              type="button"
              onClick={handleGenerateSlots}
              className="btn btn-primary mt-4 inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} />
              Generate Slots
            </button>
          </div>

          {hasGeneratedSlots && (
            <div className="rounded-2xl border border-border/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-lg text-foreground">Slot Preview</h2>
                  <p className="text-xs text-muted-foreground">
                    Edit individual prices or mark slots unavailable (e.g. lunch break).
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {sortedDraftSlots.length} slots
                </span>
              </div>

              <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {sortedDraftSlots.map((slot) => (
                  <SlotRow
                    key={slot.id}
                    slot={slot}
                    onPriceChange={updateSlotPrice}
                    onToggleAvailability={toggleSlotAvailability}
                  />
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-muted/30 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sample preview
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sortedDraftSlots.slice(0, 6).map((slot) => (
                    <span
                      key={`preview-${slot.id}`}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        slot.is_available
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground line-through"
                      }`}
                    >
                      {formatCompactSlotRange(slot.start_time, slot.end_time)}{" "}
                      {formatIndianPrice(slot.price)}
                    </span>
                  ))}
                  {sortedDraftSlots.length > 6 && (
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                      +{sortedDraftSlots.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col items-end gap-3 border-t border-border/40 pt-2">
            {saveError && (
              <p className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {saveError}
              </p>
            )}

            <div className="flex items-center gap-3">
              {(isEditingExisting || hasGeneratedSlots || draft.name) && (
                <button
                  type="button"
                  onClick={resetDraft}
                  className="btn btn-outline cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveGroup}
                disabled={saving}
                className="btn btn-primary inline-flex items-center gap-2 cursor-pointer"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Schedule Group"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
