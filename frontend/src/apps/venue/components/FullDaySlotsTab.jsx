import { useMemo, useState } from "react"
import {
  CalendarClock,
  Plus,
  Save,
  Trash2,
  Pencil,
  Ban,
  CheckCircle2,
  Clock,
  Sun,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  fullDayGroupFromApi,
  parseScheduleGroupError,
} from "@/apis/venueSchedules"
import { useVenueScheduleGroups } from "@/apps/venue/hooks/useVenueScheduleGroups"
import {
  WEEKDAYS,
  createSchedule,
  formatDaySelection,
  formatIndianPrice,
  formatSlotName,
  formatTime12Hour,
  getAvailableWeekdays,
  getAssignedDays,
  validateScheduleAgainstExisting,
  buildFullDayScheduleGroupPayload,
} from "@/apps/venue/utils/hourlySlots"

const EMPTY_DRAFT = {
  name: "",
  days: [],
  schedules: [],
}

const EMPTY_SCHEDULE_FORM = {
  name: "",
  startTime: "00:00",
  endTime: "23:59",
  price: "",
}

function ScheduleRow({ schedule, onEdit, onDelete, onToggleAvailability }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 transition-colors ${
        schedule.is_available
          ? "border-border/60 bg-white"
          : "border-border/40 bg-muted/30 opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className={`font-semibold text-foreground ${
              schedule.is_available ? "" : "line-through text-muted-foreground"
            }`}
          >
            {schedule.name}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock size={14} className="shrink-0 text-primary/70" />
            {formatTime12Hour(schedule.start_time)} – {formatTime12Hour(schedule.end_time)}
            <span className="text-border">|</span>
            {formatSlotName(schedule.start_time, schedule.end_time)}
          </p>
          <p className="mt-1 text-sm font-semibold text-primary">
            {formatIndianPrice(schedule.price)}
          </p>
          {!schedule.is_available && (
            <p className="mt-1 text-[11px] font-medium text-accent">Unavailable</p>
          )}
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onToggleAvailability(schedule.id)}
            title={schedule.is_available ? "Mark unavailable" : "Mark available"}
            className={`rounded-lg p-2 transition-colors cursor-pointer ${
              schedule.is_available
                ? "text-muted-foreground hover:bg-muted hover:text-accent"
                : "bg-accent/10 text-accent hover:bg-accent/20"
            }`}
          >
            {schedule.is_available ? <Ban size={15} /> : <CheckCircle2 size={15} />}
          </button>
          <button
            type="button"
            onClick={() => onEdit(schedule)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            title="Edit schedule"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(schedule.id)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 cursor-pointer"
            title="Remove schedule"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FullDaySlotsTab({ venue }) {
  const {
    groups,
    setGroups,
    loading,
    loadError,
    persistGroup,
    removeGroup,
  } = useVenueScheduleGroups({
    venue,
    mapGroupFromApi: fullDayGroupFromApi,
  })
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [scheduleForm, setScheduleForm] = useState(EMPTY_SCHEDULE_FORM)
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [editingScheduleId, setEditingScheduleId] = useState(null)
  const [scheduleError, setScheduleError] = useState("")
  const [saveError, setSaveError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [saving, setSaving] = useState(false)

  const isEditingExisting = Boolean(editingGroupId)
  const hasSchedules = draft.schedules.length > 0

  const sortedSchedules = useMemo(
    () =>
      [...draft.schedules].sort((a, b) =>
        a.start_time.localeCompare(b.start_time),
      ),
    [draft.schedules],
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

  const resetScheduleForm = () => {
    setScheduleForm(EMPTY_SCHEDULE_FORM)
    setEditingScheduleId(null)
    setScheduleError("")
  }

  const resetDraft = () => {
    setDraft(EMPTY_DRAFT)
    setEditingGroupId(null)
    resetScheduleForm()
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

  const handleAddOrUpdateSchedule = () => {
    setScheduleError("")
    try {
      const schedule = createSchedule({
        name: scheduleForm.name,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
        price: scheduleForm.price,
        id: editingScheduleId ?? undefined,
      })

      validateScheduleAgainstExisting(
        schedule,
        draft.schedules,
        editingScheduleId,
      )

      setDraft((prev) => {
        if (editingScheduleId) {
          return {
            ...prev,
            schedules: prev.schedules.map((item) =>
              item.id === editingScheduleId ? schedule : item,
            ),
          }
        }
        return { ...prev, schedules: [...prev.schedules, schedule] }
      })

      resetScheduleForm()
    } catch (error) {
      setScheduleError(error.message)
    }
  }

  const startEditSchedule = (schedule) => {
    setEditingScheduleId(schedule.id)
    setScheduleForm({
      name: schedule.name,
      startTime: schedule.start_time,
      endTime: schedule.end_time,
      price: String(schedule.price),
    })
    setScheduleError("")
  }

  const removeSchedule = (scheduleId) => {
    setDraft((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((schedule) => schedule.id !== scheduleId),
    }))
    if (editingScheduleId === scheduleId) resetScheduleForm()
  }

  const toggleScheduleAvailability = (scheduleId) => {
    setDraft((prev) => ({
      ...prev,
      schedules: prev.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? { ...schedule, is_available: !schedule.is_available }
          : schedule,
      ),
    }))
  }

  const startEditGroup = (group) => {
    setEditingGroupId(group.id)
    setDraft({
      name: group.name,
      days: [...group.days],
      schedules: group.schedules.map((schedule) => ({ ...schedule })),
    })
    resetScheduleForm()
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
    if (draft.schedules.length === 0) {
      setSaveError("Add at least one schedule before saving this group.")
      return
    }

    setSaving(true)

    try {
      const payload = buildFullDayScheduleGroupPayload({
        name: draft.name,
        days: draft.days,
        schedules: draft.schedules,
      })
      const saved = await persistGroup(payload, editingGroupId)
      const mapped = fullDayGroupFromApi(saved)

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
        <section className="rounded-2xl border border-border/60 bg-white/70 p-5 shadow-sm backdrop-blur-sm xl:col-span-1">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-foreground">Schedule Groups</h2>
              <p className="text-xs text-muted-foreground">
                {venue?.name ? `For ${venue.name}` : "Configure full-day schedules"}
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
              <Sun size={24} className="mx-auto text-muted-foreground/60" />
              <p className="mt-2 text-sm font-medium text-foreground">No groups yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create a schedule group and define full-day booking options.
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
                          {group.schedules.length} schedule
                          {group.schedules.length === 1 ? "" : "s"}
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
                  Name the group and assign days. Each group can include one or more
                  full-day schedules.
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
                <Sun size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">
                  {editingScheduleId ? "Edit Schedule" : "Add Schedule"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Set the schedule name, time range, and price. Use 00:00–23:59 for a
                  standard full-day booking.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                  Schedule Name
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Full Day"
                  value={scheduleForm.name}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                  Start Time
                </label>
                <input
                  type="time"
                  className="input"
                  value={scheduleForm.startTime}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
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
                  value={scheduleForm.endTime}
                  onChange={(e) =>
                    setScheduleForm((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                  Price
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
                    placeholder="e.g., 50000"
                    value={scheduleForm.price}
                    onChange={(e) =>
                      setScheduleForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {scheduleError && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {scheduleError}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAddOrUpdateSchedule}
                className="btn btn-primary inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                {editingScheduleId ? "Update Schedule" : "Add Schedule"}
              </button>
              {editingScheduleId && (
                <button
                  type="button"
                  onClick={resetScheduleForm}
                  className="btn btn-outline cursor-pointer"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </div>

          {hasSchedules && (
            <div className="rounded-2xl border border-border/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-lg text-foreground">Schedule Preview</h2>
                  <p className="text-xs text-muted-foreground">
                    How customers will see bookable options on a selected date.
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {sortedSchedules.length} schedule{sortedSchedules.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="space-y-3">
                {sortedSchedules.map((schedule) => (
                  <ScheduleRow
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={startEditSchedule}
                    onDelete={removeSchedule}
                    onToggleAvailability={toggleScheduleAvailability}
                  />
                ))}
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
              {(isEditingExisting || hasSchedules || draft.name) && (
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
