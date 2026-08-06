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
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  sessionGroupFromApi,
  parseScheduleGroupError,
} from "@/apis/venueSchedules"
import { useVenueScheduleGroups } from "@/apps/venue/hooks/useVenueScheduleGroups"
import {
  WEEKDAYS,
  createSession,
  formatDaySelection,
  formatIndianPrice,
  formatSlotName,
  formatTime12Hour,
  getAvailableWeekdays,
  getAssignedDays,
  validateSessionAgainstExisting,
  buildSessionScheduleGroupPayload,
} from "@/apps/venue/utils/hourlySlots"

const EMPTY_DRAFT = {
  name: "",
  days: [],
  sessions: [],
}

const EMPTY_SESSION_FORM = {
  name: "",
  startTime: "08:00",
  endTime: "13:00",
  price: "",
}

function SessionRow({ session, onEdit, onDelete, onToggleAvailability }) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 transition-colors ${
        session.is_available
          ? "border-border/60 bg-white"
          : "border-border/40 bg-muted/30 opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className={`font-semibold text-foreground ${
              session.is_available ? "" : "line-through text-muted-foreground"
            }`}
          >
            {session.name}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock size={14} className="shrink-0 text-primary/70" />
            {formatTime12Hour(session.start_time)} – {formatTime12Hour(session.end_time)}
            <span className="text-border">|</span>
            {formatSlotName(session.start_time, session.end_time)}
          </p>
          <p className="mt-1 text-sm font-semibold text-primary">
            {formatIndianPrice(session.price)}
          </p>
          {!session.is_available && (
            <p className="mt-1 text-[11px] font-medium text-accent">Unavailable</p>
          )}
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onToggleAvailability(session.id)}
            title={session.is_available ? "Mark unavailable" : "Mark available"}
            className={`rounded-lg p-2 transition-colors cursor-pointer ${
              session.is_available
                ? "text-muted-foreground hover:bg-muted hover:text-accent"
                : "bg-accent/10 text-accent hover:bg-accent/20"
            }`}
          >
            {session.is_available ? <Ban size={15} /> : <CheckCircle2 size={15} />}
          </button>
          <button
            type="button"
            onClick={() => onEdit(session)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            title="Edit session"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(session.id)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 cursor-pointer"
            title="Remove session"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SessionSlotsTab({ venue }) {
  const {
    groups,
    setGroups,
    loading,
    loadError,
    persistGroup,
    removeGroup,
  } = useVenueScheduleGroups({
    venue,
    mapGroupFromApi: sessionGroupFromApi,
  })
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [sessionForm, setSessionForm] = useState(EMPTY_SESSION_FORM)
  const [editingGroupId, setEditingGroupId] = useState(null)
  const [editingSessionId, setEditingSessionId] = useState(null)
  const [sessionError, setSessionError] = useState("")
  const [saveError, setSaveError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [saving, setSaving] = useState(false)

  const isEditingExisting = Boolean(editingGroupId)
  const hasSessions = draft.sessions.length > 0

  const sortedSessions = useMemo(
    () =>
      [...draft.sessions].sort((a, b) =>
        a.start_time.localeCompare(b.start_time),
      ),
    [draft.sessions],
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

  const resetSessionForm = () => {
    setSessionForm(EMPTY_SESSION_FORM)
    setEditingSessionId(null)
    setSessionError("")
  }

  const resetDraft = () => {
    setDraft(EMPTY_DRAFT)
    setEditingGroupId(null)
    resetSessionForm()
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

  const handleAddOrUpdateSession = () => {
    setSessionError("")
    try {
      const session = createSession({
        name: sessionForm.name,
        startTime: sessionForm.startTime,
        endTime: sessionForm.endTime,
        price: sessionForm.price,
        id: editingSessionId ?? undefined,
      })

      validateSessionAgainstExisting(
        session,
        draft.sessions,
        editingSessionId,
      )

      setDraft((prev) => {
        if (editingSessionId) {
          return {
            ...prev,
            sessions: prev.sessions.map((item) =>
              item.id === editingSessionId ? session : item,
            ),
          }
        }
        return { ...prev, sessions: [...prev.sessions, session] }
      })

      resetSessionForm()
    } catch (error) {
      setSessionError(error.message)
    }
  }

  const startEditSession = (session) => {
    setEditingSessionId(session.id)
    setSessionForm({
      name: session.name,
      startTime: session.start_time,
      endTime: session.end_time,
      price: String(session.price),
    })
    setSessionError("")
  }

  const removeSession = (sessionId) => {
    setDraft((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((session) => session.id !== sessionId),
    }))
    if (editingSessionId === sessionId) resetSessionForm()
  }

  const toggleSessionAvailability = (sessionId) => {
    setDraft((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, is_available: !session.is_available }
          : session,
      ),
    }))
  }

  const startEditGroup = (group) => {
    setEditingGroupId(group.id)
    setDraft({
      name: group.name,
      days: [...group.days],
      sessions: group.sessions.map((session) => ({ ...session })),
    })
    resetSessionForm()
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
    if (draft.sessions.length === 0) {
      setSaveError("Add at least one session before saving this schedule group.")
      return
    }

    setSaving(true)

    try {
      const payload = buildSessionScheduleGroupPayload({
        name: draft.name,
        days: draft.days,
        sessions: draft.sessions,
      })
      const saved = await persistGroup(payload, editingGroupId)
      const mapped = sessionGroupFromApi(saved)

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
                {venue?.name ? `For ${venue.name}` : "Configure weekly sessions"}
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
                Create a schedule group and add sessions manually.
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
                          {group.sessions.length} session
                          {group.sessions.length === 1 ? "" : "s"}
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
                  Name the group, pick days, then add sessions with custom times and prices.
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
                <Plus size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">
                  {editingSessionId ? "Edit Session" : "Add Session"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Define each bookable session with a name, time range, and price.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                  Session Name
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Morning Session"
                  value={sessionForm.name}
                  onChange={(e) =>
                    setSessionForm((prev) => ({ ...prev, name: e.target.value }))
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
                  value={sessionForm.startTime}
                  onChange={(e) =>
                    setSessionForm((prev) => ({
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
                  value={sessionForm.endTime}
                  onChange={(e) =>
                    setSessionForm((prev) => ({
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
                    placeholder="e.g., 15000"
                    value={sessionForm.price}
                    onChange={(e) =>
                      setSessionForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {sessionError && (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {sessionError}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAddOrUpdateSession}
                className="btn btn-primary inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                {editingSessionId ? "Update Session" : "Add Session"}
              </button>
              {editingSessionId && (
                <button
                  type="button"
                  onClick={resetSessionForm}
                  className="btn btn-outline cursor-pointer"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </div>

          {hasSessions && (
            <div className="rounded-2xl border border-border/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-lg text-foreground">Session Preview</h2>
                  <p className="text-xs text-muted-foreground">
                    How customers will see sessions on a selected date.
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {sortedSessions.length} session{sortedSessions.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="space-y-3">
                {sortedSessions.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    onEdit={startEditSession}
                    onDelete={removeSession}
                    onToggleAvailability={toggleSessionAvailability}
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
              {(isEditingExisting || hasSessions || draft.name) && (
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
