import { useState } from 'react'
import { createClient, deepResearchEndpoints } from '@venue404/api-client'
import type { ExternalLeadPublic } from '@venue404/api-client'
import { Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Props = { lead: ExternalLeadPublic }

export function ExternalVenueCard({ lead }: Props) {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'reserving' | 'requested' | 'error'>('idle')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form State
  const [eventDate, setEventDate] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  async function handleReserve(e: React.FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    setStatus('reserving')
    try {
      const client = createClient()
      const endpoints = deepResearchEndpoints(client)
      await endpoints.reserveLead(
        lead.id, 
        eventDate || undefined, 
        guestCount ? parseInt(guestCount, 10) : undefined, 
        phone || undefined, 
        notes || undefined
      )
      setStatus('requested')
      setIsModalOpen(false)
      navigate('/my-bookings', { state: { tab: 'reservations' } })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <>
      <article className="group cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-2xl">
        {/* ── Image ── */}
        <div className="relative aspect-[8/5] overflow-hidden rounded-2xl bg-zinc-100">
          {lead.cover_photo_url ? (
            <img
              src={lead.cover_photo_url}
              alt={lead.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-100 to-zinc-50">
              <svg className="h-9 w-9 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="px-4 text-center text-xs leading-tight text-zinc-400 line-clamp-2">
                {lead.name}
              </p>
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="py-3 px-1">
          <h5 className="truncate font-medium text-zinc-900 leading-snug transition-colors group-hover:text-brand">
            {lead.name}
          </h5>

          <p className="text-[.8rem] text-zinc-500 mt-0.5 line-clamp-2 leading-snug">
            {lead.formatted_address || lead.city || 'Location unknown'}
          </p>

          {/* Reserve button */}
          <div className="mt-3">
            {status === 'requested' ? (
              <p className="text-[.8rem] font-semibold text-emerald-600">✓ Reservation Requested</p>
            ) : (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                disabled={status === 'reserving'}
                className="w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50"
              >
                Request Reservation
              </button>
            )}
            {status === 'error' && (
              <p className="mt-1 text-center text-[10px] text-red-500">Failed. Try again.</p>
            )}
          </div>

          {/* Pleasant, soft disclaimer box */}
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50/70 p-2.5 text-emerald-800">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <p className="text-[.72rem] leading-snug">
              <span className="font-semibold block mb-0.5">Note on availability</span>
              Reservation is a request only, subject to availability and final confirmation.
            </p>
          </div>
        </div>
      </article>

      {/* Reservation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Request Venue</h2>
              <p className="mt-1 text-sm text-zinc-500">Help us negotiate on your behalf with {lead.name}.</p>
            </div>
            
            <form onSubmit={handleReserve} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-zinc-900">Event Date</label>
                <input 
                  type="date" 
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  required 
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-semibold text-zinc-900">Guest Count</label>
                <input 
                  type="number" 
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-zinc-900">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your contact number"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-zinc-900">Special Requirements</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific needs for the venue..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                />
              </div>
              
              <div className="mt-6 flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl bg-zinc-100 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === 'reserving'}
                  className="flex-1 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
                >
                  {status === 'reserving' ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

