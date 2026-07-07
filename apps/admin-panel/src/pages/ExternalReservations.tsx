import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  PhoneCall, UserCheck, Send, CalendarPlus, MapPin, Users as UsersIcon, Tag,
  X, Mail, Phone, Globe, Star, ExternalLink, StickyNote, Calendar,
} from 'lucide-react'
import { createClient, adminExternalReservationEndpoints } from '@venue404/api-client'
import type {
  ExternalReservationSummary, ExternalReservationStatus,
} from '@venue404/api-client'
import { AdminLayout } from '../components/AdminLayout'
import {
  SectionHeader, StatusBadge, EmptyState, LoadingScreen, ErrorState, Button, Modal,
} from '@venue404/ui'

const api = adminExternalReservationEndpoints(createClient())

const TABS: { label: string; value: ExternalReservationStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Owner Interested', value: 'owner_interested' },
  { label: 'Owner Invited', value: 'owner_invited' },
  { label: 'Venue Pending', value: 'venue_pending_approval' },
  { label: 'Venue Approved', value: 'venue_approved' },
  { label: 'Booking Created', value: 'booking_created' },
]

function statusVariant(s: ExternalReservationStatus): 'success' | 'danger' | 'pending' | 'warning' | 'neutral' {
  if (s === 'booking_created' || s === 'closed' || s === 'venue_approved') return 'success'
  if (s === 'cancelled' || s === 'rejected') return 'danger'
  if (s === 'new') return 'neutral'
  return 'pending'
}

function statusLabel(s: ExternalReservationStatus): string {
  return s.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const PAGE_SIZE = 12

export default function ExternalReservations() {
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<ExternalReservationStatus | ''>('')
  const [page, setPage] = useState(1)

  const [contactTarget, setContactTarget] = useState<ExternalReservationSummary | null>(null)
  const [contactMethod, setContactMethod] = useState('')
  const [contactNotes, setContactNotes] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')

  const [detailTarget, setDetailTarget] = useState<ExternalReservationSummary | null>(null)

  const [inviteTarget, setInviteTarget] = useState<ExternalReservationSummary | null>(null)
  const [venueName, setVenueName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'external-reservations', { page, status: activeTab }],
    queryFn: () => api.listReservations({ page, page_size: PAGE_SIZE, status: activeTab || undefined }),
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = data?.total_pages ?? 1

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'external-reservations'] })

  const contactMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.contactOwner(id, {
        contact_method: contactMethod,
        notes: contactNotes || undefined,
        follow_up_date: followUpDate || undefined,
      }),
    onSuccess: () => { invalidate(); closeContact() },
  })

  const markInterestedMutation = useMutation({
    mutationFn: (id: string) => api.markInterested(id),
    onSuccess: invalidate,
  })

  const inviteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.inviteOwner(id, {
        venue_name: venueName,
        owner_name: ownerName || undefined,
        email: ownerEmail,
        phone: ownerPhone || undefined,
      }),
    onSuccess: (res) => { invalidate(); setInviteLink(res.action_link) },
  })

  const createBookingMutation = useMutation({
    mutationFn: (id: string) => api.createBooking(id),
    onSuccess: invalidate,
  })

  function closeContact() {
    setContactTarget(null); setContactMethod(''); setContactNotes(''); setFollowUpDate('')
    contactMutation.reset()
  }
  function closeInvite() {
    setInviteTarget(null); setVenueName(''); setOwnerName(''); setOwnerEmail(''); setOwnerPhone('')
    setInviteLink(null); setLinkCopied(false)
    inviteMutation.reset()
  }

  return (
    <AdminLayout
      pageTitle="External Reservations"
      pageSubtitle="Convert customer reservations at unregistered venues into onboarded owners and bookings"
    >
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-5 pt-4">
          <SectionHeader
            title="Reservations"
            description={!isLoading ? `${total} ${total === 1 ? 'reservation' : 'reservations'}` : undefined}
          />
          <div className="mt-3 flex items-center gap-0.5 overflow-x-auto border-b border-zinc-100 -mx-5 px-5">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => { setActiveTab(tab.value); setPage(1) }}
                className={[
                  'relative shrink-0 px-3.5 py-2.5 text-sm font-medium transition-colors focus:outline-none',
                  activeTab === tab.value
                    ? 'text-zinc-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-brand'
                    : 'text-zinc-400 hover:text-zinc-600',
                ].join(' ')}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <div className="px-5 py-12"><LoadingScreen message="Loading reservations…" fullScreen={false} /></div>}

        {!isLoading && error && (
          <div className="px-5 py-12">
            <ErrorState
              title="Could not load reservations"
              message={error instanceof Error ? error.message : 'Failed to load reservations'}
              fullScreen={false}
              action={<Button variant="secondary" onClick={invalidate}>Retry</Button>}
            />
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="px-5 py-12">
            <EmptyState
              icon={<PhoneCall className="h-4 w-4" />}
              title="No reservations found"
              description="No external reservations match this filter."
            />
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((r) => (
              <ReservationCard
                key={r.id}
                reservation={r}
                onContact={() => setContactTarget(r)}
                onMarkInterested={() => markInterestedMutation.mutate(r.id)}
                onInvite={() => { setInviteTarget(r); setVenueName(r.lead_name) }}
                onCreateBooking={() => createBookingMutation.mutate(r.id)}
                onViewDetails={() => setDetailTarget(r)}
                markInterestedPending={markInterestedMutation.isPending}
                createBookingPending={createBookingMutation.isPending}
              />
            ))}
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500">
            <span>{((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}</span>
            <div className="flex items-center gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                className="press rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40">
                Previous
              </button>
              <span className="tabular-nums">Page {page} of {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
                className="press rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contact modal */}
      <Modal open={contactTarget !== null} onClose={closeContact}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-900/5">
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Log contact</h3>
            <p className="mb-4 text-sm text-zinc-500">
              Record how you reached out to <span className="font-medium text-zinc-800">{contactTarget?.lead_name}</span>.
            </p>
            <div className="space-y-3">
              <div>
                <label htmlFor="contact-method">Contact method</label>
                <input id="contact-method" type="text" placeholder="Phone call, WhatsApp, email…"
                  value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} autoFocus />
              </div>
              <div>
                <label htmlFor="contact-notes">Notes</label>
                <textarea id="contact-notes" rows={3} placeholder="Owner's response, availability…"
                  value={contactNotes} onChange={(e) => setContactNotes(e.target.value)} />
              </div>
              <div>
                <label htmlFor="follow-up-date">Follow-up date</label>
                <input id="follow-up-date" type="date" value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)} />
              </div>
              {contactMutation.error && (
                <p className="text-xs font-medium text-red-500">
                  {contactMutation.error instanceof Error ? contactMutation.error.message : 'Failed to log contact'}
                </p>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeContact} disabled={contactMutation.isPending}>Cancel</Button>
              <button type="button"
                onClick={() => contactTarget && contactMutation.mutate({ id: contactTarget.id })}
                disabled={contactMutation.isPending || !contactMethod.trim()}
                className="press rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-hover disabled:opacity-50">
                {contactMutation.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Invite owner modal */}
      <Modal open={inviteTarget !== null} onClose={closeInvite}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-zinc-900/5">
            {inviteLink ? (
              <>
                <h3 className="mb-1 text-base font-semibold text-zinc-900">Owner invited</h3>
                <p className="mb-4 text-sm text-zinc-500">
                  We tried emailing {ownerEmail} an account-setup link. If email delivery isn't working yet,
                  copy this link and share it with them directly (WhatsApp, SMS, etc.) — it's one-time use.
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                  <input readOnly value={inviteLink} className="flex-1 truncate border-0 bg-transparent p-0 text-xs text-zinc-600 focus:ring-0" />
                  <button type="button"
                    onClick={() => { navigator.clipboard.writeText(inviteLink); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000) }}
                    className="press shrink-0 rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-zinc-700">
                    {linkCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="mt-5 flex justify-end">
                  <Button variant="secondary" onClick={closeInvite}>Done</Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-1 text-base font-semibold text-zinc-900">Invite owner</h3>
                <p className="mb-4 text-sm text-zinc-500">
                  Creates the owner's account and a draft venue in{' '}
                  <span className="font-medium text-zinc-800">{inviteTarget?.category_label ?? 'the category the customer picked'}</span>,
                  then emails them an account-setup link.
                </p>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="venue-name">Venue name</label>
                    <input id="venue-name" type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} autoFocus />
                  </div>
                  <div>
                    <label htmlFor="owner-name">Owner name <span className="font-normal text-zinc-400 text-xs">(optional)</span></label>
                    <input id="owner-name" type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="owner-email">Email</label>
                    <input id="owner-email" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="owner-phone">Phone <span className="font-normal text-zinc-400 text-xs">(optional)</span></label>
                    <input id="owner-phone" type="tel" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} />
                  </div>
                  {inviteMutation.error && (
                    <p className="text-xs font-medium text-red-500">
                      {inviteMutation.error instanceof Error ? inviteMutation.error.message : 'Failed to invite owner'}
                    </p>
                  )}
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <Button variant="secondary" onClick={closeInvite} disabled={inviteMutation.isPending}>Cancel</Button>
                  <button type="button"
                    onClick={() => inviteTarget && inviteMutation.mutate({ id: inviteTarget.id })}
                    disabled={inviteMutation.isPending || !venueName.trim() || !ownerEmail.trim()}
                    className="press rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-hover disabled:opacity-50">
                    {inviteMutation.isPending ? 'Inviting…' : 'Send invite'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>

      {detailTarget && (
        <ReservationDetailModal reservation={detailTarget} onClose={() => setDetailTarget(null)} />
      )}
    </AdminLayout>
  )
}

// ── Reservation Card ─────────────────────────────────────────────────────────

type CardProps = {
  reservation: ExternalReservationSummary
  onContact: () => void
  onMarkInterested: () => void
  onInvite: () => void
  onCreateBooking: () => void
  onViewDetails: () => void
  markInterestedPending: boolean
  createBookingPending: boolean
}

function ReservationCard({
  reservation: r, onContact, onMarkInterested, onInvite, onCreateBooking, onViewDetails,
  markInterestedPending, createBookingPending,
}: CardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-zinc-900">{r.lead_name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400">
            <MapPin className="h-3 w-3 shrink-0" />
            {r.lead_city ?? r.lead_formatted_address ?? '—'}
          </p>
        </div>
        <StatusBadge label={statusLabel(r.status)} variant={statusVariant(r.status)} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-500">
        <div className="flex items-center gap-1"><UsersIcon className="h-3 w-3" />{r.guest_count ?? '—'} guests</div>
        <div>{r.event_date ?? 'No date set'}</div>
      </div>

      <div className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
        <Tag className="h-3 w-3 shrink-0" />
        {r.category_label ?? 'No category selected'}
      </div>

      <div className="mt-1 text-xs text-zinc-400">
        {r.customer_name ?? 'Unknown customer'}{r.customer_email ? ` · ${r.customer_email}` : ''}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3">
        {(r.status === 'new' || r.status === 'contacted') && (
          <button type="button" onClick={onContact}
            className="press inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100">
            <PhoneCall className="h-3.5 w-3.5" /> {r.status === 'new' ? 'Log Contact' : 'Update Contact'}
          </button>
        )}
        {r.status === 'contacted' && (
          <button type="button" onClick={onMarkInterested} disabled={markInterestedPending}
            className="press inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-hover disabled:opacity-50">
            <UserCheck className="h-3.5 w-3.5" /> Mark Interested
          </button>
        )}
        {r.status === 'owner_interested' && (
          <button type="button" onClick={onInvite}
            className="press inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-hover">
            <Send className="h-3.5 w-3.5" /> Invite Owner
          </button>
        )}
        {r.status === 'venue_approved' && (
          <button type="button" onClick={onCreateBooking} disabled={createBookingPending}
            className="press inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
            <CalendarPlus className="h-3.5 w-3.5" /> Create Booking
          </button>
        )}
        <button
          type="button"
          onClick={onViewDetails}
          className="ml-auto text-xs text-zinc-400 hover:text-zinc-700 underline underline-offset-2"
        >
          View details
        </button>
      </div>
    </div>
  )
}

// ── Reservation Detail Modal ─────────────────────────────────────────────────

function ContactRow({ icon, value, href }: { icon: React.ReactNode; value: string | null; href?: string }) {
  if (!value) return null
  const content = (
    <div className="flex items-center gap-2 text-sm text-zinc-600">
      <span className="text-zinc-300">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  )
  return href ? <a href={href} target="_blank" rel="noreferrer" className="hover:text-brand">{content}</a> : content
}

function InfoBlock({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-100 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-900">{value}</p>
    </div>
  )
}

function fmtDateTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

function ReservationDetailModal({ reservation: r, onClose }: { reservation: ExternalReservationSummary; onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-900/5">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">Reservation details</h3>
            <p className="mt-0.5 font-mono text-xs text-zinc-400 select-all">{r.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge label={statusLabel(r.status)} variant={statusVariant(r.status)} dot={false} />
            <button
              type="button"
              onClick={onClose}
              className="press flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5">

          {/* Event info strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoBlock label="Category" value={r.category_label ?? 'Not selected'} />
            <InfoBlock label="Guests" value={r.guest_count ?? '—'} />
            <InfoBlock label="Event date" value={r.event_date ?? 'Not set'} />
            <InfoBlock label="Requested" value={fmtDateTime(r.created_at)} />
          </div>

          {/* Two-column: customer+contact log / external venue lead */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="space-y-4">
              {/* Customer */}
              <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Customer</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-600">
                    {r.customer_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-900">{r.customer_name ?? '—'}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  <ContactRow icon={<Mail className="h-3.5 w-3.5" />} value={r.customer_email} href={r.customer_email ? `mailto:${r.customer_email}` : undefined} />
                  <ContactRow icon={<Phone className="h-3.5 w-3.5" />} value={r.customer_phone} href={r.customer_phone ? `tel:${r.customer_phone}` : undefined} />
                </div>
                {r.customer_notes && (
                  <div className="mt-3 flex items-start gap-2 border-t border-zinc-200 pt-3 text-sm text-zinc-600">
                    <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-300" />
                    <span>{r.customer_notes}</span>
                  </div>
                )}
              </div>

              {/* Admin contact log */}
              {(r.contact_method || r.contact_notes || r.follow_up_date) && (
                <div className="rounded-xl border border-zinc-100 px-4 py-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Contact log</p>
                  {r.contact_method && <p className="text-sm text-zinc-700">Reached via {r.contact_method}</p>}
                  {r.contact_notes && <p className="mt-1 text-sm text-zinc-600">{r.contact_notes}</p>}
                  {r.follow_up_date && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-zinc-400">
                      <Calendar className="h-3.5 w-3.5" /> Follow up on {r.follow_up_date}
                    </p>
                  )}
                </div>
              )}

              {/* Workflow timestamps */}
              {(r.owner_invited_at || r.booking_created_at) && (
                <div className="grid grid-cols-2 gap-3">
                  {r.owner_invited_at && <InfoBlock label="Owner invited" value={fmtDateTime(r.owner_invited_at)} />}
                  {r.booking_created_at && <InfoBlock label="Booking created" value={fmtDateTime(r.booking_created_at)} />}
                </div>
              )}
            </div>

            {/* External venue lead */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">External venue (unregistered)</p>
              <div className="flex items-center gap-3">
                {r.lead_cover_photo_url ? (
                  <img src={r.lead_cover_photo_url} alt={r.lead_name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-zinc-500">
                    <MapPin className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-900">{r.lead_name}</p>
                  <p className="truncate text-xs text-zinc-400">{r.lead_formatted_address ?? r.lead_city ?? '—'}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <ContactRow icon={<Phone className="h-3.5 w-3.5" />} value={r.lead_phone} href={r.lead_phone ? `tel:${r.lead_phone}` : undefined} />
                <ContactRow icon={<Globe className="h-3.5 w-3.5" />} value={r.lead_website} href={r.lead_website ?? undefined} />
                <ContactRow icon={<Star className="h-3.5 w-3.5" />} value={r.lead_rating != null ? `${r.lead_rating} rating` : null} />
                <ContactRow icon={<ExternalLink className="h-3.5 w-3.5" />} value={r.lead_google_maps_uri ? 'View on Google Maps' : null} href={r.lead_google_maps_uri ?? undefined} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
