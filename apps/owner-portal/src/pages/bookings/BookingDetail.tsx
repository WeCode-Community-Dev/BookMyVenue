import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Card, Button, StatusBadge, PaymentStatusBadge, Modal, Skeleton } from '@venue404/ui'
import { createClient, bookingEndpoints } from '@venue404/api-client'
import { useQuery } from '@tanstack/react-query'

import { Calendar, MapPin, User, Clock, ArrowLeft, Check, CheckCircle2, X, AlertTriangle, History, AlignLeft, Info, Receipt, MessageSquare, Lock, CalendarDays } from 'lucide-react'
import { ChatTab } from '../../components/ChatTab'
import toast from 'react-hot-toast'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toDateStringLocal(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function addMonthsLocal(d: Date, m: number) {
  const nd = new Date(d)
  nd.setMonth(nd.getMonth() + m)
  return nd
}

function MonthGrid({ 
  year, 
  month, 
  selectedDate, 
  minDate,
  maxDate,
  onSelect 
}: { 
  year: number, 
  month: number, 
  selectedDate: string,
  minDate?: string,
  maxDate?: string,
  onSelect: (d: string) => void 
}) {
  const firstDay = new Date(year, month, 1)
  const startPad = firstDay.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const grid: (string | null)[] = []
  for (let i = 0; i < startPad; i++) grid.push(null)
  for (let d = 1; d <= daysInMonth; d++) grid.push(toDateStringLocal(new Date(year, month, d)))
  while (grid.length % 7 !== 0) grid.push(null)

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map(l => <div key={l} className="text-center text-xs font-medium text-zinc-400 dark:text-zinc-400 py-1">{l}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {grid.map((dateStr, i) => {
          if (!dateStr) return <div key={i} className="h-10" />
          
          const d = parseInt(dateStr.split('-')[2], 10)
          const isDisabled = (minDate && dateStr < minDate) || (maxDate && dateStr > maxDate)
          const isSelected = dateStr === selectedDate

          let btnClass = "h-9 w-9 mx-auto rounded-full text-sm font-medium transition-colors flex items-center justify-center "
          if (isSelected) btnClass += "bg-zinc-900 text-white shadow-sm"
          else if (isDisabled) btnClass += "text-zinc-300 dark:text-zinc-600 cursor-not-allowed line-through"
          else btnClass += "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-ink-800 cursor-pointer"

          return (
            <div key={dateStr} className="text-center py-0.5">
              <button
                disabled={!!isDisabled}
                onClick={() => onSelect(dateStr)}
                className={btnClass}
                type="button"
              >
                {d}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DoubleMonthCalendar({ 
  value, 
  onChange, 
  minDate,
  maxDate
}: { 
  value: string, 
  onChange: (v: string) => void, 
  minDate?: string,
  maxDate?: string
}) {
  const [viewDate, setViewDate] = useState(() => {
    const d = value ? new Date(value) : new Date()
    d.setDate(1)
    d.setHours(0,0,0,0)
    return d
  })

  const year1 = viewDate.getFullYear()
  const month1 = viewDate.getMonth()
  const next = addMonthsLocal(viewDate, 1)
  const year2 = next.getFullYear()
  const month2 = next.getMonth()

  const label1 = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const label2 = next.toLocaleString('default', { month: 'long', year: 'numeric' })

  const minViewDate = minDate ? new Date(minDate) : new Date(0)
  minViewDate.setDate(1)
  minViewDate.setHours(0,0,0,0)
  const canGoPrev = viewDate > minViewDate

  return (
    <div className="select-none bg-white dark:bg-ink-900 p-2 sm:p-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Month 1 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button 
              type="button"
              onClick={() => setViewDate(addMonthsLocal(viewDate, -1))}
              disabled={!canGoPrev}
              className="p-1.5 text-zinc-400 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-ink-800 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label1}</div>
            <div className="w-8 h-8" />
          </div>
          <MonthGrid year={year1} month={month1} selectedDate={value} minDate={minDate} maxDate={maxDate} onSelect={onChange} />
        </div>

        {/* Month 2 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8" />
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label2}</div>
            <button 
              type="button"
              onClick={() => setViewDate(addMonthsLocal(viewDate, 1))}
              className="p-1.5 text-zinc-400 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-ink-800 rounded-full transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <MonthGrid year={year2} month={month2} selectedDate={value} minDate={minDate} maxDate={maxDate} onSelect={onChange} />
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-ink-700 flex items-center justify-start gap-5">
         <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-400">
           <span className="h-3.5 w-3.5 rounded-full bg-zinc-900"></span> Selected
         </span>
         <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-400">
           <span className="h-3.5 w-3.5 rounded-full bg-zinc-200"></span> Unavailable
         </span>
      </div>
    </div>
  )
}

export default function BookingDetail() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  
  const [tab, setTab] = useState('overview')
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [extendModalOpen, setExtendModalOpen] = useState(false)
  const [newDeadlineDate, setNewDeadlineDate] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [draftNotes, setDraftNotes] = useState('')
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelType, setCancelType] = useState<'forfeit' | 'goodwill' | null>(null)

  const { data: booking, isLoading: loading, refetch } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) return null
      return bookingEndpoints(createClient()).getBooking(bookingId)
    },
    enabled: !!bookingId,
  })

  const handleAction = async (action: 'accept' | 'reject' | 'cancelForfeit' | 'cancelGoodwill' | 'extendBalanceDeadline' | 'updateOwnerNotes', payload?: Record<string, unknown>) => {
    if (!bookingId) return
    setActionLoading(true)
    try {
      const client = createClient()
      if (action === 'accept') {
        await bookingEndpoints(client).acceptBooking(bookingId)
      } else if (action === 'reject') {
        await bookingEndpoints(client).rejectBooking(bookingId, (payload?.reason as string) || 'No reason provided')
        setRejectModalOpen(false)
      } else if (action === 'cancelForfeit') {
        await bookingEndpoints(client).cancelForfeit(bookingId)
      } else if (action === 'cancelGoodwill') {
        await bookingEndpoints(client).cancelGoodwill(bookingId)
      } else if (action === 'extendBalanceDeadline') {
        await bookingEndpoints(client).extendBalanceDeadline(bookingId, payload?.new_due_date as string)
      } else if (action === 'updateOwnerNotes') {
        await bookingEndpoints(client).updateOwnerNotes(bookingId, (payload?.notes as string) || null)
        setIsEditingNotes(false)
      }
      await refetch()
    } catch (err) {
      console.error(`Failed to ${action} booking`, err)
      toast.error(`Error performing action: ${err}`)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-[101vh] space-y-8 pb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-zinc-200 dark:border-ink-700 pb-6">
          <div className="flex items-start gap-4 w-full md:w-1/2">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-3 w-full">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        {/* Tabs Skeleton */}
        <div className="flex gap-4">
           {[1,2,3,4].map(i => <Skeleton key={i} className="h-10 w-24" />)}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-5">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <Skeleton className="h-32 w-full mt-4" />
          </Card>
          <div className="space-y-6">
            <Card className="p-6">
               <Skeleton className="h-6 w-1/3 mb-4" />
               <div className="flex items-start gap-4">
                 <Skeleton className="h-12 w-12 rounded-full" />
                 <div className="space-y-2 flex-1">
                   <Skeleton className="h-5 w-1/2" />
                   <Skeleton className="h-4 w-2/3" />
                 </div>
               </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return <div className="text-center py-20 text-zinc-500 dark:text-zinc-400">Booking not found.</div>
  }

  return (
    <div className="w-full min-h-[101vh] flex flex-col pb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Actions Layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-8 mb-6">
        <div className="flex items-start sm:items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-700 shadow-sm hover:bg-zinc-50 dark:hover:bg-ink-800 rounded-full transition-colors text-zinc-600 dark:text-zinc-400 shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">
                Booking <span className="text-zinc-500 dark:text-zinc-400 font-medium">#{booking.id.split('-')[0]}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                <StatusBadge 
                  label={booking.status.replace(/_/g, ' ').toUpperCase()} 
                  variant={
                    booking.status === 'confirmed' ? 'success' :
                    booking.status === 'requested' || booking.status === 'owner_accepted' ? 'pending' :
                    booking.status.includes('cancelled') || booking.status.includes('expired') || booking.status === 'owner_rejected' ? 'danger' :
                    'neutral'
                  }
                />
                <PaymentStatusBadge status={booking.payment_status} />
              </div>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 sm:mt-1.5">
              For <span className="font-medium text-zinc-900 dark:text-zinc-100">{booking.venue_name}</span> • Created on {new Date(booking.created_at || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Top Right Action Bar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {booking.status === 'requested' && (
            <>
              <Button variant="secondary" className="text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => setRejectModalOpen(true)} disabled={actionLoading}>
                <X className="h-4 w-4 mr-2" /> Reject
              </Button>
              <Button variant="primary" className="bg-brand-600 hover:bg-brand-700" onClick={() => handleAction('accept')} disabled={actionLoading}>
                <Check className="h-4 w-4 mr-2" /> Accept Request
              </Button>
            </>
          )}
          {booking.status === 'confirmed' && booking.balance_overdue_at && (new Date() >= new Date(booking.balance_overdue_at)) && booking.payment_status !== 'paid' && (
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-ink-700 hover:bg-zinc-100 dark:hover:bg-ink-800 bg-white dark:bg-ink-900" onClick={() => setExtendModalOpen(true)} disabled={actionLoading}>
                <Calendar className="h-4 w-4 mr-2" /> Extend Deadline
              </Button>
              <Button variant="secondary" className="text-rose-600 border-rose-200 hover:bg-rose-50 bg-white dark:bg-ink-900 shadow-sm" onClick={() => { setCancelType(null); setCancelModalOpen(true); }} disabled={actionLoading}>
                <X className="h-4 w-4 mr-2" /> Cancel Overdue Booking
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Lifecycle Alerts */}
      <div className="space-y-3 mb-6">
        {booking.status === 'requested' && booking.owner_action_deadline && (
          <div className="bg-amber-50 border border-amber-200/60 text-amber-800 px-5 py-3.5 rounded-xl flex items-center gap-3 shadow-sm">
            <Clock className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="text-sm font-medium">
              Action Required: Please accept or reject this request by <span className="font-bold">{new Date(booking.owner_action_deadline).toLocaleString()}</span>.
            </div>
          </div>
        )}
        
        {booking.status === 'owner_accepted' && booking.hold_expires_at && (
          <div className="bg-blue-50/80 border border-blue-200/60 text-blue-800 px-5 py-3.5 rounded-xl flex items-center gap-3 shadow-sm">
            <Clock className="h-5 w-5 text-blue-600 shrink-0" />
            <div className="text-sm font-medium">
              Waiting for advance payment. This hold automatically expires at <span className="font-bold">{new Date(booking.hold_expires_at).toLocaleString()}</span>.
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-zinc-200 dark:border-ink-700 mt-4 mb-8">
        <nav className="-mb-px flex w-full overflow-x-auto no-scrollbar" aria-label="Tabs">
          {[
            { id: 'overview', label: 'Overview', icon: Info },
            { id: 'financials', label: 'Financials', icon: Receipt },
            { id: 'timeline', label: 'Timeline', icon: History },
            { id: 'notes', label: 'Notes', icon: AlignLeft },
            { id: 'chat', label: 'Chat', icon: MessageSquare },
          ].map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 min-w-fit flex items-center justify-center gap-2 whitespace-nowrap pt-2 pb-3 px-2 border-b-2 font-medium text-sm transition-all ${
                  tab === t.id 
                    ? 'border-brand-500 text-brand-600' 
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:border-ink-700 dark:hover:border-ink-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
            {/* Main Column */}
            <div className="space-y-6">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-5 flex flex-col justify-center border-zinc-200 dark:border-ink-700 shadow-sm rounded-xl">
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-1.5">Booking Type</div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 capitalize">{booking.booking_type?.replace('_', ' ')}</div>
                </Card>
                <Card className="p-4 flex flex-col justify-center border-zinc-200 dark:border-ink-700 shadow-sm rounded-xl">
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-1.5">Event Type</div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{booking.event_type || 'Not specified'}</div>
                </Card>
                <Card className="p-4 flex flex-col justify-center border-zinc-200 dark:border-ink-700 shadow-sm rounded-xl">
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-1.5">Guest Count</div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{booking.guest_count} guests</div>
                </Card>
              </div>

              {/* Timeline Card */}
              <Card className="p-0 overflow-hidden border-zinc-200 dark:border-ink-700 shadow-sm rounded-xl">
                {(() => {
                  if (!booking.starts_at || !booking.ends_at) return (
                    <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">Event times are not available.</div>
                  );

                  const eventStart = new Date(booking.starts_at);
                  const eventEnd = new Date(booking.ends_at);
                  const opStart = booking.effective_starts_at ? new Date(booking.effective_starts_at) : eventStart;
                  const opEnd = booking.effective_ends_at ? new Date(booking.effective_ends_at) : eventEnd;

                  const setupMins = Math.round((eventStart.getTime() - opStart.getTime()) / 60000);
                  const teardownMins = Math.round((opEnd.getTime() - eventEnd.getTime()) / 60000);
                  const eventDurationMins = Math.round((eventEnd.getTime() - eventStart.getTime()) / 60000);

                  const isSameDay = eventStart.toDateString() === eventEnd.toDateString();

                  const formatTime = (d: Date) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(d);
                  const formatDate = (d: Date) => new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(d);
                  const formatDateTime = (d: Date) => new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }).format(d);
                  
                  const formatNodeTime = (d: Date) => isSameDay ? formatTime(d) : formatDateTime(d);

                  const formatDuration = (m: number) => {
                    const d = Math.floor(m / (24 * 60));
                    const h = Math.floor((m % (24 * 60)) / 60);
                    const mins = m % 60;
                    let parts = [];
                    if (d > 0) parts.push(`${d}d`);
                    if (h > 0) parts.push(`${h}h`);
                    if (mins > 0) parts.push(`${mins}m`);
                    return parts.join(' ') || '0m';
                  };

                  return (
                    <div className="flex flex-col">
                      <div className="p-5 bg-zinc-50/50 dark:bg-ink-800/50 border-b border-zinc-100 dark:border-ink-700 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                          <Calendar className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                          {formatDate(eventStart)} {!isSameDay && ` - ${formatDate(eventEnd)}`}
                        </div>
                        <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-700 px-3 py-1.5 rounded-lg shadow-sm">
                          Total: {formatDuration(setupMins + eventDurationMins + teardownMins)}
                        </div>
                      </div>

                      <div className="p-5 pb-8">
                        <div className="relative space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:ml-[5px] before:w-px before:bg-zinc-200">
                          {/* Setup */}
                          {setupMins > 0 && (
                            <div className="relative flex items-start group">
                              <div className="absolute left-0 mt-1.5 w-3 h-3 rounded-full border-2 border-white bg-amber-400 z-10 shadow-sm ring-1 ring-zinc-200" />
                              <div className="w-full pl-8 flex justify-between items-start gap-4">
                                <div>
                                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Setup</div>
                                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{formatDuration(setupMins)} buffer</div>
                                </div>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400 font-semibold text-right">{formatNodeTime(opStart)}</div>
                              </div>
                            </div>
                          )}

                          {/* Event */}
                          <div className="relative flex items-start group z-10">
                            <div className="absolute left-0 -ml-[1px] mt-8 w-3.5 h-3.5 rounded-full border-[3px] border-white bg-zinc-800 shadow-sm ring-1 ring-zinc-300" />
                            <div className="w-full pl-8">
                               <div className="bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-700 rounded-xl p-4 shadow-sm transition-all hover:border-zinc-300 dark:border-ink-700 dark:hover:border-ink-700">
                                  <div className="flex justify-between items-center mb-4">
                                    <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Main Event</div>
                                    <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-ink-800 px-2.5 py-1 rounded-md">{formatDuration(eventDurationMins)} duration</div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">Starts</div>
                                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1.5">{formatNodeTime(eventStart)}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">Ends</div>
                                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1.5">{formatNodeTime(eventEnd)}</div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                          </div>

                          {/* Teardown */}
                          {teardownMins > 0 && (
                            <div className="relative flex items-start group">
                              <div className="absolute left-0 mt-1.5 w-3 h-3 rounded-full border-2 border-white bg-amber-400 z-10 shadow-sm ring-1 ring-zinc-200" />
                              <div className="w-full pl-8 flex justify-between items-start gap-4">
                                <div>
                                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Teardown</div>
                                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{formatDuration(teardownMins)} buffer</div>
                                </div>
                                <div className="text-sm text-zinc-600 dark:text-zinc-400 font-semibold text-right">{formatNodeTime(opEnd)}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </Card>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Venue Snapshot */}
              <div className="flex flex-col">
                <h3 className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3 pl-1">Venue Snapshot</h3>
                <Card className="p-0 overflow-hidden border-zinc-200 dark:border-ink-700 shadow-sm rounded-xl">
                  {booking.venue_cover_photo_url && (
                    <div className="h-32 w-full bg-zinc-100 dark:bg-ink-800 relative">
                      <img src={booking.venue_cover_photo_url} alt="Venue" loading="lazy" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{booking.venue_name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center mt-1 font-medium">
                      <MapPin className="h-3.5 w-3.5 mr-1" /> {booking.venue_city || 'City not specified'}
                    </div>
                    <Link to={`/venues/${booking.venue_id}/overview`} className="text-sm text-brand-600 hover:text-brand-700 font-semibold mt-4 inline-block">
                      View Venue Details &rarr;
                    </Link>
                  </div>
                </Card>
              </div>

              {/* Customer Profile */}
              <div className="flex flex-col">
                <h3 className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3 pl-1">Customer Profile</h3>
                <Card className="p-4 overflow-hidden border-zinc-200 dark:border-ink-700 shadow-sm rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-zinc-100 dark:bg-ink-800 text-zinc-600 dark:text-zinc-400 rounded-full flex items-center justify-center shrink-0 border border-zinc-200 dark:border-ink-700 shadow-sm">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{booking.user_full_name}</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {tab === 'financials' && (() => {
          /**
           * ——————————————————————————————————————————————————
           * DERIVED STATE — all logic mirrors the backend models exactly.
           * ——————————————————————————————————————————————————
           *
           * BookingStatus enum (from models.py):
           *   requested | owner_accepted | confirmed | completed
           *   hold_expired | request_expired | conflict_cancelled
           *   user_cancelled | admin_cancelled | owner_rejected
           *   balance_overdue_cancelled
           *
           * PaymentStatus enum (from models.py):
           *   unpaid | advance_paid | fully_paid | refunded | partially_refunded
           *
           * Cancellation types (from cancellation.py):
           *   balance_overdue_cancelled  â†’ FORFEIT: owner keeps advance, refund_amount_paise stays 0
           *   user_cancelled (by owner)  â†’ GOODWILL: refund_amount_paise set per overdue_advance_refund_pct
           *   user_cancelled (by user)   â†’ USER CANCEL: refund_amount_paise set per cancellation policy tiers
           *   admin_cancelled            â†’ ADMIN: no refund logic
           *
           * Key constraint (from models.py CheckConstraint):
           *   advance_due_paise + balance_due_paise = quoted_price_paise (always true)
           */

          const fmt = (paise: number) =>
            `₹${(paise / 100).toLocaleString('en-IN')}`;

          const s = booking.status;
          const ps = booking.payment_status;

          // Payment facts — directly from backend fields
          const totalDue = booking.quoted_price_paise || 0;
          const advanceDue = booking.advance_due_paise || 0;
          const balanceDue = booking.balance_due_paise || 0;
          const amountPaid = booking.amount_paid_paise || 0;
          const refundAmount = booking.refund_amount_paise || 0;
          const platformFee = booking.platform_fee_paise || 0;
          const platformFeeReversed = booking.platform_fee_reversed_paise || 0;
          const ownerPayoutProjected = booking.owner_payout_paise || 0; // projected full payout
          const commissionPct = booking.platform_commission_pct || 0;

          // One-time settlement: advance_pct === 100 means full payment upfront, no balance split
          const isOneTimeSettlement = booking.advance_pct === 100;

          // Payment status booleans — match PaymentStatus enum exactly
          const isAdvancePaid = ps === 'advance_paid';
          const isFullyPaid = ps === 'fully_paid';
          const isRefunded = ps === 'refunded';
          const isPartiallyRefunded = ps === 'partially_refunded';
          const isBalancePaid = isFullyPaid || (amountPaid >= totalDue && totalDue > 0);

          // Booking status booleans — match BookingStatus enum exactly
          const isCompleted = s === 'completed';
          const isForfeitCancelled = s === 'balance_overdue_cancelled'; // owner kept the advance
          const isUserCancelled = s === 'user_cancelled';               // goodwill or user self-cancel
          const isAdminCancelled = s === 'admin_cancelled';
          const isTerminated = isForfeitCancelled || isUserCancelled || isAdminCancelled ||
            s === 'hold_expired' || s === 'request_expired' || s === 'conflict_cancelled';

          // The true "Final Owner Payout" — only set when booking is definitively settled
          // null = still in progress (show projected)
          const finalPayout: number | null = (isTerminated || isCompleted)
            ? (booking.final_owner_payout_paise ?? booking.owner_payout_paise ?? 0)
            : null;  // still active — show projected

          // The actual platform fee charged is always the full platform fee (deducted upfront)
          const actualPlatformFee = platformFee;
          // Overdue state
          const isOverdue = booking.balance_overdue_at
            ? new Date() >= new Date(booking.balance_overdue_at)
            : false;
          const balanceDatePassed = booking.balance_due_date
            ? new Date() > new Date(booking.balance_due_date)
            : false;

          return (
            <div className="space-y-5 max-w-5xl mx-auto">

              {/* ── HERO BANNER ── */}
              <div className={`rounded-2xl overflow-hidden shadow-lg ${
                isTerminated
                  ? 'bg-gradient-to-r from-zinc-900 to-zinc-800'
                  : isCompleted
                  ? 'bg-gradient-to-r from-emerald-900 to-teal-800'
                  : 'bg-gradient-to-r from-zinc-900 to-zinc-800'
              }`}>
                <div className="px-8 py-6 md:px-10 md:py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                  {/* Payout number */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400 mb-1.5">
                      {finalPayout !== null ? 'Final Owner Payout' : 'Projected Owner Payout'}
                    </p>
                    <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
                      {finalPayout !== null ? fmt(finalPayout) : fmt(ownerPayoutProjected)}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                      <span className="text-sm text-zinc-400 dark:text-zinc-400">Quoted {fmt(totalDue)}</span>
                      <span className="text-zinc-700 dark:text-zinc-300 text-xs">|</span>
                      <span className="text-sm text-zinc-400 dark:text-zinc-400">Commission {commissionPct}%</span>
                      {amountPaid > 0 && (
                        <>
                          <span className="text-zinc-700 dark:text-zinc-300 text-xs">|</span>
                          <span className="text-sm text-zinc-300 dark:text-zinc-600 font-medium">Collected {fmt(amountPaid)}</span>
                        </>
                      )}
                      {refundAmount > 0 && (
                        <>
                          <span className="text-zinc-700 dark:text-zinc-300 text-xs">|</span>
                          <span className="text-sm text-rose-400 font-medium">Refunded {fmt(refundAmount)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status pills */}
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {isOneTimeSettlement ? (
                      /* One-time settlement: single full payment pill */
                      <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border ${
                        isFullyPaid || isRefunded || isPartiallyRefunded
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}>
                        {isFullyPaid || isRefunded || isPartiallyRefunded
                          ? <CheckCircle2 className="w-4 h-4" />
                          : <Clock className="w-4 h-4" />
                        }
                        Full Payment {fmt(totalDue)}
                      </div>
                    ) : (
                      <>
                        {/* Advance pill */}
                        <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border ${
                          isAdvancePaid || isFullyPaid || isRefunded || isPartiallyRefunded
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                          {isAdvancePaid || isFullyPaid || isRefunded || isPartiallyRefunded
                            ? <CheckCircle2 className="w-4 h-4" />
                            : <Clock className="w-4 h-4" />
                          }
                          Advance {fmt(advanceDue)}
                        </div>
                        {/* Balance pill */}
                        <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border ${
                          isFullyPaid
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : isForfeitCancelled
                            ? 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400 dark:text-zinc-400'
                            : isTerminated
                            ? 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400 dark:text-zinc-400'
                            : isOverdue
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                          {isFullyPaid ? <CheckCircle2 className="w-4 h-4" /> : isOverdue ? <AlertTriangle className="w-4 h-4" /> : <CalendarDays className="w-4 h-4" />}
                          Balance {fmt(balanceDue)}
                        </div>
                      </>
                    )}
                    {/* Commission pill */}
                    <div className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border bg-rose-500/10 border-rose-500/20 text-rose-400">
                      <Receipt className="w-4 h-4" />
                      Fee -{fmt(actualPlatformFee)}
                    </div>
                  </div>
                </div>

                {/* Progress bar (only on active bookings) */}
                {!isTerminated && !isCompleted && (
                  <div className="px-8 md:px-10 pb-6">
                    <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                      <span>Payment Progress</span>
                      <span className="font-bold text-zinc-400 dark:text-zinc-400">
                        {Math.round((amountPaid / (totalDue || 1)) * 100)}% collected
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-700/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, (amountPaid / (totalDue || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── CANCELLATION OUTCOME (only when terminated) ── */}
              {isTerminated && (
                <div className={`rounded-xl border p-5 flex items-start gap-4 ${
                  isForfeitCancelled
                    ? 'bg-amber-50 border-amber-200'
                    : refundAmount > 0
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-zinc-50 dark:bg-ink-800 border-zinc-200 dark:border-ink-700'
                }`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    isForfeitCancelled ? 'bg-amber-100 text-amber-700' : refundAmount > 0 ? 'bg-rose-100 text-rose-600' : 'bg-zinc-200 text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {isForfeitCancelled ? <Lock className="w-4 h-4" /> : refundAmount > 0 ? <AlertTriangle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${isForfeitCancelled ? 'text-amber-900' : refundAmount > 0 ? 'text-rose-900' : 'text-zinc-800 dark:text-zinc-200'}`}>
                      {isForfeitCancelled && 'Balance Overdue — Deposit Forfeited'}
                      {isUserCancelled && refundAmount > 0 && 'User Cancelled — Refund Issued'}
                      {isUserCancelled && refundAmount === 0 && 'User Cancelled — No Refund'}
                      {isAdminCancelled && 'Admin Cancelled'}
                      {(s === 'hold_expired' || s === 'request_expired') && 'Booking Expired'}
                      {s === 'conflict_cancelled' && 'Cancelled — Conflict'}
                    </p>
                    <p className={`text-sm mt-0.5 leading-relaxed ${isForfeitCancelled ? 'text-amber-800/80' : refundAmount > 0 ? 'text-rose-700/80' : 'text-zinc-500 dark:text-zinc-400'}`}>
                      {isForfeitCancelled && `Customer missed the balance payment deadline. Advance of ${fmt(advanceDue)} is forfeited. Your net share after ${commissionPct}% commission: ${fmt(ownerPayoutProjected)}.`}
                      {isUserCancelled && refundAmount > 0 && `${fmt(refundAmount)} was refunded to the customer based on your cancellation policy. You retain ${fmt(amountPaid - refundAmount)} minus platform commission.`}
                      {isUserCancelled && refundAmount === 0 && `No refund was issued to the customer based on your cancellation policy. You retain the full collected amount.`}
                      {isAdminCancelled && 'This booking was cancelled by a platform administrator.'}
                    </p>
                    {booking.cancelled_at && (
                      <p className="text-xs text-zinc-400 dark:text-zinc-400 mt-1.5">
                        Cancelled {new Date(booking.cancelled_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ── OVERDUE ALERT (active confirmed bookings only) ── */}
              {s === 'confirmed' && isAdvancePaid && balanceDatePassed && !isTerminated && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 flex items-start gap-4">
                  <div className="w-9 h-9 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-rose-900 text-sm">Balance Payment Overdue</p>
                    <p className="text-sm text-rose-700/80 mt-0.5 leading-relaxed">
                      Due date was {booking.balance_due_date && new Date(booking.balance_due_date).toLocaleDateString()}.
                      {isOverdue && ` Marked overdue at ${new Date(booking.balance_overdue_at!).toLocaleString()}.`}
                      {' '}Customer has used <strong className="text-rose-900">{booking.deadline_extension_count}</strong> of 2 allowed extension(s).
                    </p>
                    {booking.owner_action_deadline && (
                      <p className="text-xs text-rose-700 mt-1.5 font-medium">
                        Action window closes: {new Date(booking.owner_action_deadline).toLocaleString()}
                      </p>
                    )}
                    {isOverdue && (
                      <div className="mt-3 pt-3 border-t border-rose-200">
                        <Button
                          variant="secondary"
                          className="bg-white dark:bg-ink-900 text-rose-700 border-rose-200 hover:bg-rose-100 font-semibold shadow-sm text-sm"
                          onClick={() => setExtendModalOpen(true)}
                        >
                          Extend Deadline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── BOTTOM GRID: RECEIPT + MILESTONES ── */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                {/* Receipt card */}
                <div className="lg:col-span-2">
                  <Card className="p-0 overflow-hidden border-zinc-200 dark:border-ink-700 shadow-sm rounded-xl h-full">
                    <div className="px-5 py-4 border-b border-zinc-100 dark:border-ink-700 bg-zinc-50 dark:bg-ink-800 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-zinc-400 dark:text-zinc-400" />
                      <h3 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">Price Breakdown</h3>
                    </div>
                    <div className="p-5 space-y-0">
                      {(isOneTimeSettlement
                        ? [
                            { label: 'Quoted Price', value: fmt(totalDue), color: 'text-zinc-800 dark:text-zinc-200' },
                          ]
                        : [
                            { label: 'Quoted Price', value: fmt(totalDue), color: 'text-zinc-800 dark:text-zinc-200' },
                            { label: `Advance (${booking.advance_pct}%)`, value: fmt(advanceDue), color: 'text-zinc-600 dark:text-zinc-400' },
                            { label: `Balance (${100 - booking.advance_pct}%)`, value: fmt(balanceDue), color: 'text-zinc-600 dark:text-zinc-400' },
                          ]
                      ).map(row => (
                        <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-ink-700">
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">{row.label}</span>
                          <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-ink-700">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">Platform Fee ({commissionPct}%)</span>
                        <span className="text-sm font-semibold text-rose-600">-{fmt(actualPlatformFee)}</span>
                      </div>
                      {platformFeeReversed > 0 && (
                        <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-ink-700">
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">Platform Fee Refunded</span>
                          <span className="text-sm font-semibold text-emerald-600">+{fmt(platformFeeReversed)}</span>
                        </div>
                      )}
                      {refundAmount > 0 && (
                        <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-ink-700">
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">Refund Issued</span>
                          <span className="text-sm font-semibold text-rose-600">-{fmt(refundAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-3 pb-1">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                          {finalPayout !== null ? 'Final Payout' : 'Projected Payout'}
                        </span>
                        <span className="font-black text-emerald-600 text-base">{fmt(finalPayout !== null ? finalPayout : ownerPayoutProjected)}</span>
                      </div>
                      {amountPaid > 0 && amountPaid < totalDue && (
                        <div className="mt-2 pt-3 border-t border-dashed border-zinc-200 dark:border-ink-700 space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-xs text-zinc-400 dark:text-zinc-400">Collected so far</span>
                            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">{fmt(amountPaid)}</span>
                          </div>
                          {refundAmount > 0 && (
                            <div className="flex justify-between">
                              <span className="text-xs text-zinc-400 dark:text-zinc-400">Refunded to customer</span>
                              <span className="text-xs text-rose-500 font-medium">-{fmt(refundAmount)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Milestones */}
                <div className="lg:col-span-3 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-400">Payment Milestones</p>

                  {isOneTimeSettlement ? (
                    /* One-time settlement: single full payment card */
                    <Card className={`p-0 overflow-hidden border shadow-sm rounded-xl ${
                      isFullyPaid || isRefunded || isPartiallyRefunded
                        ? 'border-emerald-100'
                        : isTerminated
                        ? 'border-zinc-100 dark:border-ink-700 opacity-70'
                        : 'border-zinc-200 dark:border-ink-700'
                    }`}>
                      <div className="p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isFullyPaid || isRefunded || isPartiallyRefunded
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}>
                          {isFullyPaid || isRefunded || isPartiallyRefunded
                            ? <CheckCircle2 className="w-5 h-5" />
                            : <Clock className="w-5 h-5" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Full Payment</h4>
                            <span className="text-[10px] font-bold bg-zinc-100 dark:bg-ink-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded uppercase">One-time</span>
                          </div>
                          {booking.stripe_advance_payment_intent_id
                            ? <p className="text-xs text-zinc-400 dark:text-zinc-400 font-mono mt-0.5 truncate">Ref: {booking.stripe_advance_payment_intent_id}</p>
                            : <p className="text-xs text-zinc-400 dark:text-zinc-400 mt-0.5">Required to confirm booking</p>
                          }
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-black text-zinc-900 dark:text-zinc-100 text-base">{fmt(totalDue)}</div>
                          {isFullyPaid || isRefunded || isPartiallyRefunded
                            ? <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Paid</span>
                            : isTerminated
                            ? <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wide">Waived</span>
                            : <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Pending</span>
                          }
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <>
                      {/* Advance */}
                      <Card className={`p-0 overflow-hidden border shadow-sm rounded-xl ${
                        isAdvancePaid || isFullyPaid || isRefunded || isPartiallyRefunded
                          ? 'border-emerald-100'
                          : 'border-zinc-200 dark:border-ink-700'
                      }`}>
                        <div className="p-4 flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            isAdvancePaid || isFullyPaid || isRefunded || isPartiallyRefunded
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-amber-100 text-amber-600'
                          }`}>
                            {isAdvancePaid || isFullyPaid || isRefunded || isPartiallyRefunded
                              ? <CheckCircle2 className="w-5 h-5" />
                              : <Clock className="w-5 h-5" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Advance Deposit</h4>
                              <span className="text-[10px] font-bold bg-zinc-100 dark:bg-ink-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded uppercase">{booking.advance_pct}%</span>
                            </div>
                            {booking.stripe_advance_payment_intent_id
                              ? <p className="text-xs text-zinc-400 dark:text-zinc-400 font-mono mt-0.5 truncate">Ref: {booking.stripe_advance_payment_intent_id}</p>
                              : <p className="text-xs text-zinc-400 dark:text-zinc-400 mt-0.5">Required to confirm booking</p>
                            }
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-black text-zinc-900 dark:text-zinc-100 text-base">{fmt(advanceDue)}</div>
                            {isAdvancePaid || isFullyPaid || isRefunded || isPartiallyRefunded
                              ? <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Paid</span>
                              : <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Pending</span>
                            }
                          </div>
                        </div>
                      </Card>

                      {/* Balance */}
                      <Card className={`p-0 overflow-hidden border shadow-sm rounded-xl ${
                        isBalancePaid ? 'border-emerald-100'
                        : isOverdue ? 'border-rose-200'
                        : isForfeitCancelled || isTerminated ? 'border-zinc-100 dark:border-ink-700 opacity-70'
                        : 'border-zinc-200 dark:border-ink-700'
                      }`}>
                        <div className="p-4 flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            isBalancePaid ? 'bg-emerald-100 text-emerald-600'
                            : isOverdue ? 'bg-rose-100 text-rose-600'
                            : 'bg-zinc-100 dark:bg-ink-800 text-zinc-400 dark:text-zinc-400'
                          }`}>
                            {isBalancePaid ? <CheckCircle2 className="w-5 h-5" /> : isOverdue ? <AlertTriangle className="w-5 h-5" /> : <CalendarDays className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Balance Due</h4>
                              <span className="text-[10px] font-bold bg-zinc-100 dark:bg-ink-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded uppercase">{100 - booking.advance_pct}%</span>
                            </div>
                            {booking.stripe_balance_payment_intent_id
                              ? <p className="text-xs text-zinc-400 dark:text-zinc-400 font-mono mt-0.5 truncate">Ref: {booking.stripe_balance_payment_intent_id}</p>
                              : booking.balance_due_date
                              ? <p className={`text-xs mt-0.5 font-medium ${isOverdue ? 'text-rose-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                  Due {new Date(booking.balance_due_date).toLocaleDateString()}{isOverdue && ' — OVERDUE'}
                                </p>
                              : <p className="text-xs text-zinc-400 dark:text-zinc-400 mt-0.5">Paid before event</p>
                            }
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-black text-zinc-900 dark:text-zinc-100 text-base">{fmt(balanceDue)}</div>
                            {isBalancePaid ? <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Paid</span>
                            : isForfeitCancelled ? <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wide">Forfeited</span>
                            : isTerminated ? <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-400 uppercase tracking-wide">Waived</span>
                            : isOverdue ? <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">Overdue</span>
                            : <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Pending</span>
                            }
                          </div>
                        </div>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {tab === 'timeline' && (

          <div className="max-w-2xl mx-auto">
            <div className="rounded-lg border border-zinc-100 dark:border-ink-700 bg-white dark:bg-ink-900 p-6 shadow-sm">
              <div className="space-y-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-400">
                  Booking Timeline
                </div>

                <div className="space-y-0">
                  {(() => {
                    const now = new Date()
                    const eventStarted = booking.starts_at ? now >= new Date(booking.starts_at) : false
                    const advancePaid = booking.payment_status === 'partially_paid' || booking.payment_status === 'paid'
                    
                    const acceptedStatuses = ['owner_accepted', 'confirmed', 'completed']
                    const confirmedStatuses = ['confirmed', 'completed']

                    const steps = [
                      { label: 'Requested', completed: true, desc: 'Booking request submitted.' },
                      { label: 'Accepted', completed: acceptedStatuses.includes(booking.status), desc: 'Venue owner accepted the request.' },
                      { label: 'Advance Paid', completed: advancePaid, desc: 'Advance payment received.' },
                      { label: 'Confirmed', completed: confirmedStatuses.includes(booking.status), desc: booking.confirmed_at ? `Confirmed on ${new Date(booking.confirmed_at).toLocaleString()}` : 'Booking reservation confirmed.' },
                      { label: 'Event Day', completed: eventStarted, desc: 'Event date has arrived.' },
                      { label: 'Completed', completed: booking.status === 'completed', desc: 'Booking lifecycle completed.' },
                    ]

                    const currentStepIndex = steps.findIndex((step) => !step.completed)

                    return steps.map((step, index) => {
                      const isCompleted = step.completed
                      const isCurrent = index === currentStepIndex
                      const isLast = index === steps.length - 1

                      return (
                        <div key={step.label} className="flex gap-4">
                          {/* Timeline rail */}
                          <div className="flex flex-col items-center">
                            <div
                              className={[
                                'h-4 w-4 rounded-full transition-all',
                                isCompleted ? 'bg-[#2B5C4E]' : isCurrent ? 'bg-[#E2ECE9] ring-4 ring-[#E9F0EE]' : 'bg-zinc-200',
                              ].join(' ')}
                            />

                            {!isLast && (
                              <div
                                className={[
                                  'min-h-[48px] w-px flex-1',
                                  isCompleted ? 'bg-[#B3C8C1]' : 'bg-zinc-200',
                                ].join(' ')}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="pb-8">
                            <div
                              className={[
                                'font-medium',
                                isCompleted ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400',
                              ].join(' ')}
                            >
                              {step.label}
                            </div>
                            <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{step.desc}</div>
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>

                {booking.cancelled_at && (
                  <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 mt-6">
                    <div className="text-sm font-medium text-rose-800">Booking Cancelled</div>
                    <div className="mt-1 text-xs text-rose-700">Cancelled on {new Date(booking.cancelled_at).toLocaleString()}</div>
                  </div>
                )}
                {booking.expired_at && (
                  <div className="rounded-xl border border-zinc-200 dark:border-ink-700 bg-zinc-50 dark:bg-ink-800 px-4 py-3 mt-6">
                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Booking Expired</div>
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Expired on {new Date(booking.expired_at).toLocaleString()} due to inactivity or non-payment.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* User Notes */}
            <Card className="p-6 h-full flex flex-col relative overflow-hidden border-zinc-200 dark:border-ink-700 shadow-sm rounded-xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-zinc-300 dark:bg-ink-700"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-zinc-100 dark:bg-ink-800 text-zinc-600 dark:text-zinc-400 rounded-lg shadow-inner border border-zinc-200/50">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">Customer Request</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">Notes provided during booking</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                {booking.user_notes ? (
                  <div className="flex-1 bg-zinc-50/50 dark:bg-ink-800/50 rounded-lg p-5 text-zinc-700 dark:text-zinc-300 text-sm whitespace-pre-wrap border border-zinc-100 dark:border-ink-700 leading-relaxed relative group transition-colors hover:bg-zinc-50 dark:hover:bg-ink-800">
                    <span className="absolute -left-1 -top-3 text-5xl text-zinc-200 dark:text-ink-700 leading-none select-none font-serif opacity-50 group-hover:opacity-80 transition-opacity">"</span>
                    <div className="relative z-10 pt-1">
                      {booking.user_notes}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-400 py-10 border-2 border-dashed border-zinc-100 dark:border-ink-700 rounded-lg bg-zinc-50/30 dark:bg-ink-800/30">
                    <MessageSquare className="h-8 w-8 mb-3 opacity-20" />
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No specific requests</span>
                    <span className="text-xs mt-1">The customer did not leave any notes.</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Owner Internal Notes */}
            <Card className="p-6 h-full flex flex-col relative overflow-hidden border-amber-200 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-950/20 shadow-sm rounded-xl">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 dark:bg-amber-500"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-lg shadow-inner border border-amber-200/50 dark:border-amber-800/50">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-900 dark:text-amber-500 text-base">Internal Notes</h3>
                    <p className="text-xs text-amber-700/70 dark:text-amber-500/70 font-medium mt-0.5">Private to your team</p>
                  </div>
                </div>
                {!isEditingNotes && (
                  <Button variant="secondary" className="h-8 px-3.5 text-xs font-semibold bg-white dark:bg-ink-900 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700 transition-colors shadow-sm" onClick={() => {
                    setDraftNotes(booking.owner_notes || '')
                    setIsEditingNotes(true)
                  }}>
                    {booking.owner_notes ? 'Edit Notes' : 'Add Note'}
                  </Button>
                )}
              </div>
              
              <div className="flex-1 flex flex-col">
                {isEditingNotes ? (
                  <div className="space-y-3 flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    <textarea 
                      className="w-full rounded-lg border border-amber-300/60 dark:border-amber-900/60 bg-white/80 dark:bg-ink-950 p-4 text-sm text-amber-950 dark:text-amber-100 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all shadow-inner flex-1 min-h-[160px] resize-none"
                      placeholder="Add private notes, reminders, or special arrangements..."
                      value={draftNotes}
                      onChange={(e) => setDraftNotes(e.target.value)}
                      disabled={actionLoading}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <Button variant="secondary" className="h-9 px-4 text-xs font-semibold bg-white dark:bg-ink-900 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30" onClick={() => setIsEditingNotes(false)} disabled={actionLoading}>Cancel</Button>
                      <Button variant="primary" className="h-9 px-4 text-xs font-semibold bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-600 border-none text-white shadow-sm" onClick={() => handleAction('updateOwnerNotes', { notes: draftNotes })} disabled={actionLoading}>Save Internal Notes</Button>
                    </div>
                  </div>
                ) : (
                  booking.owner_notes ? (
                    <div className="flex-1 bg-white/70 dark:bg-ink-900/50 rounded-lg p-5 text-amber-950 dark:text-amber-100 text-sm whitespace-pre-wrap border border-amber-200/50 dark:border-amber-900/50 shadow-sm leading-relaxed">
                      {booking.owner_notes}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-amber-700/50 dark:text-amber-600/50 py-10 border-2 border-dashed border-amber-200/60 dark:border-amber-900/50 rounded-lg bg-amber-50/50 dark:bg-amber-950/20">
                      <AlignLeft className="h-8 w-8 mb-3 opacity-40" />
                      <span className="text-sm font-medium text-amber-800/60 dark:text-amber-500/60">No internal notes yet</span>
                      <span className="text-xs mt-1">Add reminders or staff instructions here.</span>
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        )}

        {tab === 'chat' && (
          <div className="max-w-2xl mx-auto">
            <ChatTab bookingId={bookingId!} />
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <Modal 
          open={rejectModalOpen} 
          onClose={() => setRejectModalOpen(false)}
        >
          <div className="p-8">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-5 border border-rose-100 shadow-sm">
              <X className="h-6 w-6" />
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Reject Booking Request</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">Please provide a reason for rejecting this booking. The user will be notified.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Reason for rejection <span className="text-rose-500">*</span></label>
              <textarea 
                className="w-full border border-zinc-200 dark:border-ink-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-inner bg-zinc-50/50 resize-none"
                rows={4}
                placeholder="e.g. Venue is under maintenance, dates unavailable..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-zinc-100 dark:border-ink-700">
               <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
               <Button variant="primary" className="bg-rose-600 hover:bg-rose-700 text-white border-none shadow-sm" onClick={() => handleAction('reject', { reason: rejectReason })}>Reject Request</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Extend Deadline Modal */}
      {extendModalOpen && (
        <Modal 
          open={extendModalOpen} 
          onClose={() => setExtendModalOpen(false)}
          className="max-w-3xl"
        >
          <div className="p-8">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-5 border border-amber-100 shadow-sm">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Extend Balance Deadline</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">Select a new due date for the balance payment. This gives the customer more time to pay.</p>
            </div>
            
            <div className="bg-zinc-50/50 p-2 rounded-lg border border-zinc-100 dark:border-ink-700">
              <DoubleMonthCalendar 
                value={newDeadlineDate}
                minDate={new Date().toISOString().split('T')[0]}
                maxDate={booking.starts_at ? new Date(new Date(booking.starts_at).getTime() - 86400000).toISOString().split('T')[0] : undefined}
                onChange={setNewDeadlineDate}
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-zinc-100 dark:border-ink-700">
               <Button variant="secondary" onClick={() => setExtendModalOpen(false)}>Cancel</Button>
               <Button variant="primary" className="bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm" onClick={() => {
                 if (newDeadlineDate) {
                   handleAction('extendBalanceDeadline', { new_due_date: newDeadlineDate })
                   setExtendModalOpen(false)
                 }
               }} disabled={!newDeadlineDate}>Confirm Extension</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <Modal 
          open={cancelModalOpen} 
          onClose={() => setCancelModalOpen(false)}
          className="max-w-xl"
        >
          <div className="p-8">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-ink-800 text-zinc-600 dark:text-zinc-400 rounded-full flex items-center justify-center mb-5 border border-zinc-200/50 shadow-sm">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Cancel Booking</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">Choose how you want to process this cancellation. This action cannot be undone.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setCancelType('forfeit')}
                className={`text-left p-5 rounded-lg border-2 transition-all ${
                  cancelType === 'forfeit' 
                    ? 'border-brand-500 bg-brand-50/50 shadow-sm' 
                    : 'border-zinc-200 dark:border-ink-700 bg-zinc-50/30 hover:border-brand-200 hover:bg-zinc-50 dark:hover:bg-ink-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">Standard Cancel</span>
                  {cancelType === 'forfeit' && (
                    <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  The customer forfeits their deposit (0% refund). You retain the full collected advance amount, minus the standard platform commission.
                </p>
              </button>
              
              <button 
                type="button"
                onClick={() => setCancelType('goodwill')}
                className={`text-left p-5 rounded-lg border-2 transition-all ${
                  cancelType === 'goodwill' 
                    ? 'border-rose-500 bg-rose-50/50 shadow-sm' 
                    : 'border-zinc-200 dark:border-ink-700 bg-zinc-50/30 hover:border-rose-200 hover:bg-zinc-50 dark:hover:bg-ink-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">Goodwill Cancel</span>
                  {cancelType === 'goodwill' && (
                    <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Calculates a refund based on your venue's "Overdue Advance Refund (%)" policy. Note: The full platform fee was already collected upfront and is non-refundable.
                </p>
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-zinc-100 dark:border-ink-700">
               <Button variant="secondary" onClick={() => setCancelModalOpen(false)}>Cancel</Button>
               <Button 
                 variant="primary" 
                 className={`${cancelType === 'goodwill' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-brand-600 hover:bg-brand-700'} text-white border-none shadow-sm transition-colors`} 
                 onClick={() => {
                   if (cancelType) {
                     handleAction(cancelType === 'forfeit' ? 'cancelForfeit' : 'cancelGoodwill')
                     setCancelModalOpen(false)
                   }
                 }} 
                 disabled={!cancelType || actionLoading}
               >
                 Confirm Cancellation
               </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
