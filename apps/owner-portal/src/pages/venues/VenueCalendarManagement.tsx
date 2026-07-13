import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, Link } from 'react-router-dom'
import { Button, Input, Skeleton, DatePicker } from '@venue404/ui'
import { ArrowLeft, ArrowRight, Loader2, Save, Trash2, Clock, Ban, Calendar } from 'lucide-react'
import { createClient, venueEndpoints } from '@venue404/api-client'
import type { VenueAvailability as Availability, BlockedDate } from '@venue404/api-client'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { confirmAction } from '../../lib/confirm'
import { TimeSelect } from '../../components/TimeSelect'

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

export default function VenueCalendarManagement() {
  const { venueId } = useParams()
  const [activeTab, setActiveTab] = useState<'weekly' | 'blocked'>('weekly')
  
  const [error, setError] = useState<string | null>(null)
  
  // Weekly state
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [savingWeekly, setSavingWeekly] = useState(false)
  
  // Blocked dates state
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [addingBlock, setAddingBlock] = useState(false)
  
  const [startsTime, setStartsTime] = useState('09:00:00')
  const [endsTime, setEndsTime] = useState('17:00:00')
  const [startsDate, setStartsDate] = useState('')
  const [endsDate, setEndsDate] = useState('')

  const { data, isLoading: loading } = useQuery({
    queryKey: ['calendar-data', venueId],
    queryFn: async () => {
      if (!venueId) return null
      const client = createClient()
      const [availData, blockedData] = await Promise.all([
        venueEndpoints(client).getVenueAvailability(venueId),
        venueEndpoints(client).getBlockedDates(venueId)
      ])
      return { availData, blockedData }
    },
    enabled: !!venueId,
  })

  useEffect(() => {
    if (data) {
      const { availData, blockedData } = data
      const defaults: Availability[] = DAYS_OF_WEEK.map((_, idx) => ({
        day_of_week: idx,
        is_available: true,
        opens_at: '09:00:00',
        closes_at: '18:00:00',
        spans_next_day: false,
      }))
      const merged = defaults.map(def => {
        const existing = availData?.find(a => a.day_of_week === def.day_of_week)
        return existing ? { ...def, ...existing } : def
      })
      setAvailabilities(merged)
      if (blockedData) setBlockedDates(blockedData)
    }
  }, [data])

  const handleWeeklyChange = (index: number, field: keyof Availability, value: string | boolean | null) => {
    setAvailabilities(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const saveWeekly = async () => {
    if (!venueId) return
    setSavingWeekly(true)
    setError(null)

    // Validation for availability times
    for (const avail of availabilities) {
      if (avail.is_available) {
        if (!avail.opens_at || !avail.closes_at) {
          setError(`Opening and closing times are required for ${DAYS_OF_WEEK[avail.day_of_week]} if available.`)
          setSavingWeekly(false)
          return
        }
        
        if (!avail.spans_next_day) {
          const openStr = avail.opens_at.slice(0, 5)
          const closeStr = avail.closes_at.slice(0, 5)
          if (closeStr <= openStr) {
            setError(`For ${DAYS_OF_WEEK[avail.day_of_week]}, closing time must be after opening time. If you intend to close the next day, please check the 'Closes next day' box.`)
            setSavingWeekly(false)
            return
          }
        }
      }
    }

    try {
      const client = createClient()
      const data = await venueEndpoints(client).bulkUpdateVenueAvailability(venueId, {
        availabilities
      })
      // Re-merge returned data so all 7 days remain visible
      const defaults: Availability[] = DAYS_OF_WEEK.map((_, idx) => ({
        day_of_week: idx,
        is_available: true,
        opens_at: '09:00:00',
        closes_at: '18:00:00',
        spans_next_day: false,
      }))
      const merged = defaults.map(def => {
        const saved = data?.find(a => a.day_of_week === def.day_of_week)
        return saved ? {
          day_of_week: saved.day_of_week,
          is_available: saved.is_available,
          opens_at: saved.opens_at,
          closes_at: saved.closes_at,
          spans_next_day: saved.spans_next_day,
        } : def
      })
      setAvailabilities(merged)
      toast.success("Weekly schedule saved successfully.")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save schedule")
    } finally {
      setSavingWeekly(false)
    }
  }

  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!venueId) return
    const formData = new FormData(e.target as HTMLFormElement)
    const starts_date = formData.get('starts_date') as string
    const starts_time = formData.get('starts_time') as string
    const ends_date = formData.get('ends_date') as string
    const ends_time = formData.get('ends_time') as string
    const reason = formData.get('reason') as string

    if (!starts_date || !starts_time || !ends_date || !ends_time) {
      setError("Start and end times are required")
      return
    }

    const starts_at = `${starts_date}T${starts_time}`
    const ends_at = `${ends_date}T${ends_time}`

    if (new Date(ends_at) <= new Date(starts_at)) {
      setError("End time must be strictly after start time")
      return
    }

    setAddingBlock(true)
    setError(null)
    try {
      const client = createClient()
      const newBlock = await venueEndpoints(client).createBlockedDate(venueId, {
        starts_at: new Date(starts_at).toISOString(),
        ends_at: new Date(ends_at).toISOString(),
        reason: reason || null
      })
      setBlockedDates(prev => [...prev, newBlock].sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()))
      ;(e.target as HTMLFormElement).reset()
      setStartsDate('')
      setEndsDate('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to block date")
    } finally {
      setAddingBlock(false)
    }
  }

  const handleDeleteBlockedDate = async (id: string) => {
    if (!venueId || !(await confirmAction("Are you sure you want to unblock this date?"))) return
    setError(null)
    try {
      const client = createClient()
      await venueEndpoints(client).deleteBlockedDate(venueId, id)
      setBlockedDates(prev => prev.filter(b => b.id !== id))
      toast.success("Blocked date removed.")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to unblock date")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 pb-12 max-w-5xl mx-auto pt-4">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-4 border-b border-zinc-200 dark:border-ink-700 mb-6 pb-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="bg-zinc-50 dark:bg-ink-800 rounded-xl border border-zinc-200 dark:border-ink-700 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-200 dark:border-ink-700">
            <Skeleton className="col-span-3 h-5 w-full" />
            <Skeleton className="col-span-2 h-5 w-full" />
            <Skeleton className="col-span-3 h-5 w-full" />
            <Skeleton className="col-span-3 h-5 w-full" />
            <Skeleton className="col-span-1 h-5 w-full" />
          </div>
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-zinc-100 dark:border-ink-700 bg-white dark:bg-ink-900">
              <Skeleton className="col-span-3 h-5 w-24" />
              <div className="col-span-2 flex justify-center"><Skeleton className="h-4 w-4 rounded" /></div>
              <Skeleton className="col-span-3 h-9 w-full rounded-md" />
              <Skeleton className="col-span-3 h-9 w-full rounded-md" />
              <div className="col-span-1 flex justify-center"><Skeleton className="h-4 w-4 rounded" /></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const portalTarget = typeof document !== 'undefined' ? document.getElementById('topbar-portal-target') : null;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto pt-6">
      {portalTarget && createPortal(
        <Link to={`/venues/${venueId}/overview`} className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 transition-colors flex items-center gap-1.5 bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-700 px-3 py-1.5 rounded-md shadow-sm hover:bg-zinc-50 dark:hover:bg-ink-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </Link>,
        portalTarget
      )}


      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-zinc-200 dark:border-ink-700 mb-6">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'weekly' ? 'text-brand' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Weekly Schedule
          </div>
          {activeTab === 'weekly' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('blocked')}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'blocked' ? 'text-brand' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4" />
            Blocked Dates
          </div>
          {activeTab === 'blocked' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t-full" />
          )}
        </button>
      </div>

      {/* Weekly Availability */}
      {activeTab === 'weekly' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Manage Weekly Schedule</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Set your standard operating hours for each day of the week. Uncheck the "Available" box if your venue is closed on a specific day.
            </p>
          </div>
          <div className="bg-zinc-50 dark:bg-ink-800 rounded-xl border border-zinc-200 dark:border-ink-700 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-200 dark:border-ink-700 bg-zinc-100/50 dark:bg-ink-950/50 font-medium text-sm text-zinc-700 dark:text-zinc-300">
              <div className="col-span-3">Day</div>
              <div className="col-span-2 text-center">Available</div>
              <div className="col-span-3">Opening Time</div>
              <div className="col-span-3">Closing Time</div>
              <div className="col-span-1 text-center" title="Closes next day">+1d</div>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-ink-800 bg-white dark:bg-ink-900">
              {availabilities.map((avail, index) => (
                <div key={avail.day_of_week} className={`grid grid-cols-12 gap-4 p-4 items-center ${!avail.is_available ? 'opacity-50 bg-zinc-50 dark:bg-ink-800' : ''}`}>
                  <div className="col-span-3 font-medium text-zinc-900 dark:text-zinc-100">
                    {DAYS_OF_WEEK[avail.day_of_week]}
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <input 
                      type="checkbox" 
                      checked={avail.is_available} 
                      onChange={(e) => handleWeeklyChange(index, 'is_available', e.target.checked)}
                      className="rounded text-brand focus:ring-brand w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="col-span-3">
                    <TimeSelect 
                      value={avail.opens_at || ''} 
                      onChange={(e) => handleWeeklyChange(index, 'opens_at', e.target.value ? e.target.value : null)}
                      disabled={!avail.is_available}
                    />
                  </div>
                  <div className="col-span-3">
                    <TimeSelect 
                      value={avail.closes_at || ''} 
                      onChange={(e) => handleWeeklyChange(index, 'closes_at', e.target.value ? e.target.value : null)}
                      disabled={!avail.is_available}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <input 
                      type="checkbox" 
                      checked={avail.spans_next_day} 
                      onChange={(e) => handleWeeklyChange(index, 'spans_next_day', e.target.checked)}
                      disabled={!avail.is_available}
                      className="rounded text-brand focus:ring-brand w-4 h-4 cursor-pointer"
                      title="Closes next day"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="primary" onClick={saveWeekly} disabled={savingWeekly}>
              {savingWeekly ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {savingWeekly ? 'Saving...' : 'Save Weekly Schedule'}
            </Button>
          </div>
        </div>
      )}

      {/* Blocked Dates */}
      {activeTab === 'blocked' && (
        <div className="space-y-10">
          <div className="mb-2">
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Manage Blocked Dates</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Block out specific dates and times when your venue will be unavailable for booking (e.g., for maintenance, private events, or holidays). Blocked dates will override your standard weekly schedule.
            </p>
          </div>
          <div className="relative">
            <form onSubmit={handleAddBlockedDate} className="bg-white dark:bg-ink-900 p-5 rounded-2xl border border-zinc-200 dark:border-ink-700 shadow-sm space-y-6 relative">
              {/* Subtle background gradient blob */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              </div>

              <div className="flex items-center gap-3 relative">
                <div className="p-2 bg-brand/10 rounded-lg text-brand">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Add Blocked Date</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Block off specific dates so no new bookings can be requested.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {/* Start Range */}
                <div className="space-y-5 p-5 bg-gradient-to-br from-zinc-50 to-white dark:from-ink-800 dark:to-ink-900 rounded-xl border border-zinc-100 dark:border-ink-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-ink-700 pb-4">
                    <span className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-sm font-bold text-brand">1</span>
                    <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">Start Range</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <DatePicker label="Date" name="starts_date" value={startsDate} onChange={setStartsDate} required />
                    <TimeSelect label="Time" name="starts_time" value={startsTime} onChange={(e) => setStartsTime(e.target.value)} required />
                  </div>
                </div>

                {/* End Range */}
                <div className="space-y-5 p-5 bg-gradient-to-br from-zinc-50 to-white dark:from-ink-800 dark:to-ink-900 rounded-xl border border-zinc-100 dark:border-ink-700 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-ink-700 pb-4">
                    <span className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-sm font-bold text-brand">2</span>
                    <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">End Range</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <DatePicker label="Date" name="ends_date" value={endsDate} onChange={setEndsDate} required />
                    <TimeSelect label="Time" name="ends_time" value={endsTime} onChange={(e) => setEndsTime(e.target.value)} required />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end relative">
                <div className="md:col-span-8">
                  <Input label="Reason (Optional)" name="reason" placeholder="e.g. Maintenance, Private Event, Renovation" />
                </div>
                <div className="md:col-span-4">
                  <Button type="submit" variant="primary" disabled={addingBlock} className="w-full h-10 shadow-md hover:shadow-lg transition-shadow bg-zinc-900 hover:bg-zinc-800 text-white border-transparent">
                    {addingBlock ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Ban className="h-4 w-4 mr-2 opacity-70" />}
                    {addingBlock ? 'Adding...' : 'Block Date'}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <section>
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Upcoming Blocked Dates</h4>
            {blockedDates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-zinc-50/50 dark:bg-ink-950/20 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-ink-700">
                <div className="w-16 h-16 bg-white dark:bg-ink-900 rounded-full flex items-center justify-center shadow-sm mb-4 border border-zinc-100 dark:border-ink-700">
                  <Ban className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 font-medium">No upcoming blocked dates.</p>
                <p className="text-sm text-zinc-400 dark:text-zinc-400 mt-1 max-w-sm text-center">Dates you block will appear here so you can easily unblock them later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {blockedDates.map(block => {
                  const start = new Date(block.starts_at)
                  const end = new Date(block.ends_at)
                  const dateOpts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
                  const timeOpts: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' }
                  
                  return (
                    <div key={block.id} className="group relative flex flex-col md:flex-row justify-between md:items-center p-5 pl-6 bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-700 rounded-xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 overflow-hidden">
                      {/* Left border accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>

                      <div className="flex items-start gap-5">
                        <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-red-50 border border-red-100 text-red-500 shrink-0">
                          <Ban className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-zinc-900 dark:text-zinc-100 mb-2">
                            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-ink-800 px-3 py-1.5 rounded-lg border border-zinc-100 dark:border-ink-700">
                              <span className="font-semibold">{start.toLocaleString('en-US', dateOpts)}</span>
                              <span className="text-zinc-400 dark:text-zinc-400 text-sm font-normal">at</span>
                              <span className="font-medium text-brand">{start.toLocaleString('en-US', timeOpts)}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 hidden md:block" />
                            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-ink-800 px-3 py-1.5 rounded-lg border border-zinc-100 dark:border-ink-700">
                              <span className="font-semibold">{end.toLocaleString('en-US', dateOpts)}</span>
                              <span className="text-zinc-400 dark:text-zinc-400 text-sm font-normal">at</span>
                              <span className="font-medium text-brand">{end.toLocaleString('en-US', timeOpts)}</span>
                            </div>
                          </div>
                          
                          {block.reason ? (
                            <div className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2 mt-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
                              <span>{block.reason}</span>
                            </div>
                          ) : (
                            <div className="text-sm text-zinc-400 dark:text-zinc-400 italic flex items-center gap-2 mt-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-200"></span>
                              <span>No specific reason provided</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Subtly visible Unblock button (not hidden on mobile) */}
                      <button 
                        onClick={() => handleDeleteBlockedDate(block.id)}
                        className="mt-5 md:mt-0 self-start md:self-center flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50/50 hover:bg-red-50 border border-transparent hover:border-red-100 px-4 py-2.5 rounded-lg transition-all shrink-0"
                        title="Unblock date"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Unblock</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
