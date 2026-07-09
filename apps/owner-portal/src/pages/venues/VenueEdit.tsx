import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { Card, Button, Input, LocationPickerMap, InfoTooltip, Skeleton, Select } from '@venue404/ui'
import { ArrowLeft } from 'lucide-react'
import * as Icons from 'lucide-react'
import toast from 'react-hot-toast'
import { confirmAction } from '../../lib/confirm'
import { createClient, venueEndpoints } from '@venue404/api-client'
import type { Venue, VenuePhoto } from '@venue404/api-client'
import { useQuery } from '@tanstack/react-query'
import { StateSelect } from '../../components/StateSelect'
import { DurationInput } from '../../components/DurationInput'
import { TimeSelect } from '../../components/TimeSelect'

interface HoursToDaysInputProps {
  defaultValue?: string | number
  label?: string
  name?: string
  type?: string
  min?: number | string
  placeholder?: string
  required?: boolean
  info?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

function HoursToDaysInput({ defaultValue, ...props }: HoursToDaysInputProps) {
  const [val, setVal] = useState<string | number>(defaultValue || '');
  const h = Number(val);
  const suffix = (!isNaN(h) && h > 0) ? `≈ ${parseFloat((h / 24).toFixed(2))} days` : undefined;

  return (
    <Input 
      {...props} 
      defaultValue={defaultValue} 
      onChange={(e) => {
        setVal(e.target.value);
        if (props.onChange) props.onChange(e);
      }} 
      suffix={suffix} 
    />
  );
}

export default function VenueEdit() {
  const { venueId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [localPhotos, setLocalPhotos] = useState<VenuePhoto[]>([])

  const [allowFullDay, setAllowFullDay] = useState(false)
  const [allowTimeSlot, setAllowTimeSlot] = useState(false)

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  // E.g. /venues/123/edit/pricing -> 'pricing'
  const editSection = location.pathname.split('/').pop() || 'details'

  useEffect(() => {
    if (editSection === 'blocked-dates') {
      navigate(`/venues/${venueId}/calendar`, { replace: true })
    }
  }, [editSection, navigate, venueId])

  const [venue, setVenue] = useState<Venue | null>(null)

  const { data: fetchedVenue, isLoading: loadingVenue, refetch: refetchVenue } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      if (!venueId) return null
      return venueEndpoints(createClient()).getMyVenue(venueId)
    },
    enabled: !!venueId,
  })

  const { data: platformAmenities = [] } = useQuery({
    queryKey: ['platform-amenities'],
    queryFn: async () => venueEndpoints(createClient()).getPlatformAmenities(),
    enabled: editSection === 'amenities',
  })

  const { data: venueCategories = [] } = useQuery({
    queryKey: ['venue-categories'],
    queryFn: async () => venueEndpoints(createClient()).getVenueCategories(),
    enabled: editSection === 'details',
  })

  const loading = loadingVenue

  useEffect(() => {
    if (fetchedVenue && !isEditing) {
      setVenue(fetchedVenue)
    }
  }, [fetchedVenue, isEditing])

  useEffect(() => {
    if (venue?.photos) {
      setLocalPhotos([...venue.photos].sort((a, b) => a.sort_order - b.sort_order))
    }
    if (venue?.allowed_booking_types) {
      setAllowFullDay(venue.allowed_booking_types.includes('full_day'))
      setAllowTimeSlot(venue.allowed_booking_types.includes('time_slot'))
    }
    if (venue?.amenities) {
      setSelectedAmenities(venue.amenities.map(a => a.id))
    }
  }, [venue])

  const makeCover = (index: number) => {
    const newPhotos = [...localPhotos]
    const [item] = newPhotos.splice(index, 1)
    newPhotos.unshift(item)
    setLocalPhotos(newPhotos)
  }

  const movePhoto = (index: number, direction: number) => {
    const newPhotos = [...localPhotos]
    const item = newPhotos.splice(index, 1)[0]
    newPhotos.splice(index + direction, 0, item)
    setLocalPhotos(newPhotos)
  }

  const titleMap: Record<string, string> = {
    'details': 'Basic Details',
    'photos': 'Manage Photos',
    'amenities': 'Amenities',
    'operating-hours': 'Operating Hours',
    'booking-settings': 'Booking Settings',
    'pricing': 'Pricing',
    'policies': 'Cancellation Policies'
  }



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!venueId || !venue) return

    setSaving(true)
    const formData = new FormData(e.currentTarget)
    const updates: Record<string, unknown> = {}

    // Extract form data based on current section
    if (editSection === 'details') {
      const minCapStr = formData.get('min_capacity') as string
      const maxCapStr = formData.get('max_capacity') as string
      
      if (minCapStr && maxCapStr) {
        if (parseInt(minCapStr, 10) > parseInt(maxCapStr, 10)) {
          toast.error("Min Capacity cannot exceed Max Capacity.")
          setSaving(false)
          return
        }
      }

      updates.name = formData.get('name')
      updates.description = formData.get('description')
      updates.category_id = formData.get('category_id')
      updates.min_capacity = minCapStr ? parseInt(minCapStr, 10) : null
      updates.max_capacity = parseInt(maxCapStr, 10)
      updates.city = formData.get('city')
      updates.state = formData.get('state')
      updates.country = formData.get('country') || 'India'
      updates.postal_code = formData.get('postal_code')
      updates.latitude = venue.latitude
      updates.longitude = venue.longitude
      updates.address_line1 = formData.get('address_line1')
      updates.address_line2 = formData.get('address_line2')
    } else if (editSection === 'operating-hours') {
      const ot = formData.get('open_time') as string
      const ct = formData.get('close_time') as string
      const spansNextDay = formData.get('spans_next_day') === 'on'
      
      if (!spansNextDay) {
        if (ct <= ot) {
          toast.error("Closing time must be after opening time unless 'Closes next day' is checked.")
          setSaving(false)
          return
        }
      }

      updates.open_time = ot.split(':').length === 2 ? ot + ':00' : ot
      updates.close_time = ct.split(':').length === 2 ? ct + ':00' : ct
      updates.spans_next_day = spansNextDay
    } else if (editSection === 'booking-settings') {
      const allowFullDay = formData.get('allow_full_day') === 'on'
      const allowTimeSlot = formData.get('allow_time_slot') === 'on'
      
      const newAllowedTypes = []
      if (allowFullDay) newAllowedTypes.push('full_day')
      if (allowTimeSlot) newAllowedTypes.push('time_slot')

      if (newAllowedTypes.length === 0) {
        toast.error("You must allow at least one booking type.")
        setSaving(false)
        return
      }
      updates.allowed_booking_types = newAllowedTypes

      let calculatedPricingMode = 'mixed'
      if (allowFullDay && !allowTimeSlot) calculatedPricingMode = 'flat'
      if (!allowFullDay && allowTimeSlot) calculatedPricingMode = 'hourly'

      updates.pricing_mode = calculatedPricingMode

      const minDurStr = formData.get('min_booking_duration_minutes') as string
      const maxDurStr = formData.get('max_booking_duration_minutes') as string

      if (minDurStr && maxDurStr) {
        if (parseInt(minDurStr, 10) > parseInt(maxDurStr, 10)) {
          toast.error("Min Booking Duration cannot exceed Max Booking Duration.")
          setSaving(false)
          return
        }
      }

      updates.min_booking_duration_minutes = parseInt(minDurStr, 10)
      updates.max_booking_duration_minutes = parseInt(maxDurStr, 10)
      updates.slot_interval_minutes = parseInt(formData.get('slot_interval_minutes') as string, 10)
      updates.pre_buffer_minutes = parseInt(formData.get('pre_buffer_minutes') as string, 10)
      updates.post_buffer_minutes = parseInt(formData.get('post_buffer_minutes') as string, 10)
      
      const ownerActionStr = formData.get('owner_action_window_hours') as string | null
      updates.owner_action_window_hours = ownerActionStr ? parseInt(ownerActionStr, 10) : (venue.owner_action_window_hours || 48)
      
      updates.booking_mode = formData.get('booking_mode') as string
    } else if (editSection === 'pricing') {
      const basePrice = formData.get('base_price') as string
      const hourlyRate = formData.get('hourly_rate') as string

      if (allowFullDay && !basePrice) {
        toast.error("Please enter a Base Price.")
        setSaving(false)
        return
      }
      if (allowTimeSlot && !hourlyRate) {
        toast.error("Please enter an Hourly Rate.")
        setSaving(false)
        return
      }

      const minPricePct = parseFloat(formData.get('min_price_pct') as string)
      const maxPricePct = parseFloat(formData.get('max_price_pct') as string)

      if (minPricePct > maxPricePct) {
        toast.error("Min Price % cannot exceed Max Price %.")
        setSaving(false)
        return
      }

      updates.starting_price_paise = parseInt(basePrice || '0', 10) * 100
      updates.hourly_rate_paise = parseInt(hourlyRate || '0', 10) * 100
      updates.advance_pct = parseFloat(formData.get('advance_pct') as string)
      updates.balance_due_days_before_event = parseInt(formData.get('balance_due') as string, 10)
      updates.min_price_pct = minPricePct
      updates.max_price_pct = maxPricePct
    }

    try {
      const client = createClient()
      
      if (editSection === 'policies') {
        const t1h = formData.get('tier_1_hours') as string
        const t1p = formData.get('tier_1_refund_pct') as string
        const t2h = formData.get('tier_2_hours') as string
        const t2p = formData.get('tier_2_refund_pct') as string
        const t3h = formData.get('tier_3_hours') as string
        const t3p = formData.get('tier_3_refund_pct') as string

        // Pairing checks
        if ((t1h && !t1p) || (!t1h && t1p)) {
          toast.error("Tier 1: Hours and Refund % must both be filled or both be empty.")
          setSaving(false)
          return
        }
        if ((t2h && !t2p) || (!t2h && t2p)) {
          toast.error("Tier 2: Hours and Refund % must both be filled or both be empty.")
          setSaving(false)
          return
        }
        if ((t3h && !t3p) || (!t3h && t3p)) {
          toast.error("Tier 3: Hours and Refund % must both be filled or both be empty.")
          setSaving(false)
          return
        }

        // Descending checks
        const t1hv = t1h ? parseInt(t1h, 10) : null
        const t2hv = t2h ? parseInt(t2h, 10) : null
        const t3hv = t3h ? parseInt(t3h, 10) : null

        if (t1hv !== null && t2hv !== null && t1hv <= t2hv) {
          toast.error("Tier 1 hours must be strictly greater than Tier 2 hours.")
          setSaving(false)
          return
        }
        if (t2hv !== null && t3hv !== null && t2hv <= t3hv) {
          toast.error("Tier 2 hours must be strictly greater than Tier 3 hours.")
          setSaving(false)
          return
        }

        const policyPayload: Record<string, unknown> = {
          no_show_refund_pct: parseFloat(formData.get('no_show_refund_pct') as string || '0'),
          platform_fee_refundable: false,
          notes: formData.get('notes') as string || null,
        }
        
        if (t1h && t1p) {
          policyPayload.tier_1_hours = parseInt(t1h, 10)
          policyPayload.tier_1_refund_pct = parseFloat(t1p)
        }
        
        if (t2h && t2p) {
          policyPayload.tier_2_hours = parseInt(t2h, 10)
          policyPayload.tier_2_refund_pct = parseFloat(t2p)
        }
        
        if (t3h && t3p) {
          policyPayload.tier_3_hours = parseInt(t3h, 10)
          policyPayload.tier_3_refund_pct = parseFloat(t3p)
        }

        await venueEndpoints(client).updateCancellationPolicy(venueId, policyPayload)
        
        // Also update the overdue_advance_refund_pct which belongs to the venue
        const venueUpdates = {
          overdue_advance_refund_pct: parseFloat(formData.get('overdue_advance_refund_pct') as string || '0')
        }
        const updatedVenue = await venueEndpoints(client).updateVenue(venueId, venueUpdates)
        setVenue(updatedVenue)
      } else if (editSection === 'photos') {
        const payload = {
          photos: localPhotos.map((p, i) => ({
            photo_id: p.id,
            sort_order: i,
            is_cover: i === 0
          }))
        }
        await venueEndpoints(client).bulkUpdateVenuePhotos(venueId, payload)
      } else if (editSection === 'amenities') {
        await venueEndpoints(client).updateVenueAmenities(venueId, { amenity_ids: selectedAmenities })
      } else if (editSection === 'blocked-dates') {
        // Blocked dates are managed immediately via inline actions. No overarching save needed.
      } else {
        await venueEndpoints(client).updateVenue(venueId, updates)
      }
      
      await refetchVenue()
      setIsEditing(false)
    } catch (err) {
      console.error("Failed to update venue", err)
      toast.error("Failed to save changes. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pb-12 space-y-6 pt-4">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card className="p-8 space-y-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full rounded-md" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-24 w-full rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        </Card>
      </div>
    )
  }

  if (!venue) {
    return <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">Venue not found.</div>
  }

  const portalTarget = typeof document !== 'undefined' ? document.getElementById('topbar-portal-target') : null;

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6 pt-6">
      {portalTarget && createPortal(
        <Link to={`/venues/${venueId}/overview`} className="text-sm font-medium text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:text-zinc-100 transition-colors flex items-center gap-1.5 bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-800 px-3 py-1.5 rounded-md shadow-sm hover:bg-zinc-50 dark:hover:bg-ink-800 dark:bg-ink-800">
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </Link>,
        portalTarget
      )}


      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="">
          <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-ink-800 bg-zinc-50/50 rounded-t-xl">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{titleMap[editSection] || 'Venue'}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">Update your venue settings below.</p>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <Button variant="primary" type="button" onClick={() => setIsEditing(true)}>
                  <Icons.Edit2 className="w-4 h-4 mr-2" />
                  Edit {titleMap[editSection] || 'Details'}
                </Button>
              ) : (
                <>
                  <Button variant="ghost" type="button" onClick={() => setIsEditing(false)} disabled={saving}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className={`p-8 ${!isEditing ? 'opacity-90 pointer-events-none' : ''}`}>
          
          {editSection === 'details' && (
            <div className="space-y-6">
              <Input label="Venue Name" name="name" defaultValue={venue.name} required />
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600">Venue Category<span className="text-red-500 ml-1">*</span></label>
                <Select
                  name="category_id"
                  value={venue.category?.id || ''}
                  onChange={(val) => setVenue(prev => prev ? { ...prev, category: { id: val, name: '', label: '' } as any } : null)}
                  options={venueCategories.map(cat => ({ label: `${cat.icon ? `${cat.icon} ` : ''}${cat.label}`, value: cat.id }))}
                  placeholder={venueCategories.length === 0 ? 'Loading categories...' : 'Select a category...'}
                  disabled={venueCategories.length === 0}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1">Description</label>
                <textarea 
                  name="description"
                  rows={4}
                  defaultValue={venue.description || ''}
                  className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-ink-800"
                />
              </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input label="Min Capacity" name="min_capacity" type="number" min={1} defaultValue={venue.min_capacity || ''} />
                  <Input label="Max Capacity" name="max_capacity" type="number" min={1} defaultValue={venue.max_capacity} required />
                </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-ink-800">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Location</h4>
                <Input label="Address Line 1" name="address_line1" value={venue.address_line1 || ''} onChange={e => setVenue(prev => prev ? { ...prev, address_line1: e.target.value } : null)} required />
                <Input label="Address Line 2" name="address_line2" value={venue.address_line2 || ''} onChange={e => setVenue(prev => prev ? { ...prev, address_line2: e.target.value } : null)} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" name="city" value={venue.city || ''} onChange={e => setVenue(prev => prev ? { ...prev, city: e.target.value } : null)} required />
                  <StateSelect
                    value={venue.state ?? ''}
                    onChange={(val) => setVenue(prev => prev ? { ...prev, state: val } : null)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Country" name="country" value="India" disabled required />
                  <Input label="Postal Code" name="postal_code" value={venue.postal_code || ''} onChange={e => setVenue(prev => prev ? { ...prev, postal_code: e.target.value } : null)} />
                </div>
                <div className="pt-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1">Pinpoint Location on Map</label>
                  <LocationPickerMap
                    latitude={venue.latitude ? parseFloat(venue.latitude) : null}
                    longitude={venue.longitude ? parseFloat(venue.longitude) : null}
                    onChange={(lat, lng, addr) => {
                      setVenue(prev => {
                        if (!prev) return null
                        const update: Venue = { ...prev, latitude: String(lat), longitude: String(lng) }
                        if (addr) {
                          if (addr.address_line1) update.address_line1 = addr.address_line1
                          if (addr.address_line2) update.address_line2 = addr.address_line2
                          if (addr.city) update.city = addr.city
                          if (addr.state) update.state = addr.state
                          if (addr.country) update.country = addr.country
                          if (addr.postal_code) update.postal_code = addr.postal_code
                        }
                        return update
                      })
                    }}
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mt-1">Click on the map to set the exact coordinates of your venue.</p>
                </div>
              </div>
            </div>
          )}

          {editSection === 'booking-settings' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Allowed Booking Types</h4>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600">
                    <input 
                      type="checkbox" 
                      name="allow_full_day" 
                      checked={allowFullDay}
                      onChange={e => setAllowFullDay(e.target.checked)}
                      className="rounded text-brand focus:ring-brand" 
                    />
                    Full Day
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600">
                    <input 
                      type="checkbox" 
                      name="allow_time_slot" 
                      checked={allowTimeSlot}
                      onChange={e => setAllowTimeSlot(e.target.checked)}
                      className="rounded text-brand focus:ring-brand" 
                    />
                    Time Slot
                  </label>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-ink-800">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Booking Limits & Buffers</h4>
                <div className="space-y-6 max-w-3xl">
                  <div className="grid md:grid-cols-2 gap-12">
                    <DurationInput label="Min Booking Duration" name="min_booking_duration_minutes" defaultValue={venue.min_booking_duration_minutes} required info="The shortest allowed duration for a time-slot booking." />
                    <DurationInput label="Max Booking Duration" name="max_booking_duration_minutes" defaultValue={venue.max_booking_duration_minutes} required info="The longest allowed duration for a time-slot booking." />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-12 pt-4 border-t border-zinc-50">
                    <DurationInput label="Slot Interval" name="slot_interval_minutes" defaultValue={venue.slot_interval_minutes} required helperText="e.g. 30 means bookings start at :00 and :30" info="The intervals at which bookings can start. For example, a 30-minute interval means bookings can start at 9:00, 9:30, 10:00, etc." />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-12 pt-4 border-t border-zinc-50">
                    <DurationInput label="Pre-Buffer (Setup time)" name="pre_buffer_minutes" defaultValue={venue.pre_buffer_minutes} required helperText="Gap required before a booking" info="Mandatory gap time added BEFORE a booking starts to allow for venue setup or cleaning." />
                    <DurationInput label="Post-Buffer (Teardown time)" name="post_buffer_minutes" defaultValue={venue.post_buffer_minutes} required helperText="Gap required after a booking" info="Mandatory gap time added AFTER a booking ends to allow for teardown or buffer before the next client arrives." />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-ink-800">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Booking Mode</h4>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-zinc-200 dark:border-ink-800 bg-white dark:bg-ink-950 flex-1 hover:border-brand-300 transition-colors">
                    <input type="radio" name="booking_mode" value="MANUAL" checked={venue.booking_mode !== 'INSTANT'} onChange={() => setVenue(prev => prev ? { ...prev, booking_mode: 'MANUAL' } : null)} className="mt-1 text-brand focus:ring-brand w-4 h-4" />
                    <div>
                      <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">Request to Book (Manual)</span>
                      <span className="block text-xs text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mt-1">You must manually review and Accept/Reject each booking request.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-zinc-200 dark:border-ink-800 bg-white dark:bg-ink-950 flex-1 hover:border-brand-300 transition-colors">
                    <input type="radio" name="booking_mode" value="INSTANT" checked={venue.booking_mode === 'INSTANT'} onChange={() => setVenue(prev => prev ? { ...prev, booking_mode: 'INSTANT' } : null)} className="mt-1 text-brand focus:ring-brand w-4 h-4" />
                    <div>
                      <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">Instant Booking <span className="px-1.5 py-0.5 bg-brand-100 text-brand-700 text-[10px] uppercase rounded font-bold tracking-wider">Recommended</span></span>
                      <span className="block text-xs text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mt-1">Customers can instantly secure dates. No manual approval required.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-ink-800">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Approval Window</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Owner Action Window (Hours)" name="owner_action_window_hours" type="number" min={24} max={72} defaultValue={venue.owner_action_window_hours} required={venue.booking_mode !== 'INSTANT'} disabled={venue.booking_mode === 'INSTANT'} helperText="How long you have to accept/reject a pending request before it auto-cancels." info="The maximum time you have to review and Accept/Reject a booking request. If no action is taken, the booking is automatically canceled." />
                </div>
              </div>
            </div>
          )}

          {editSection === 'pricing' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Pricing</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className={!allowFullDay ? 'opacity-50 pointer-events-none' : ''}>
                    <Input label="Base Price (₹) (Full Day)" name="base_price" type="number" min={0} defaultValue={(venue.starting_price_paise || 0) / 100} disabled={!allowFullDay} required={allowFullDay} info="The total price for a full day booking." />
                  </div>
                  <div className={!allowTimeSlot ? 'opacity-50 pointer-events-none' : ''}>
                    <Input label="Hourly Rate (₹) (Time Slot)" name="hourly_rate" type="number" min={0} defaultValue={(venue.hourly_rate_paise || 0) / 100} disabled={!allowTimeSlot} required={allowTimeSlot} info="The price per hour for short time-slot bookings." />
                  </div>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 italic mt-2">Prices will only be applied if the corresponding booking type is enabled in Booking Settings.</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-ink-800">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Payment Terms</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Token Advance (%)" name="advance_pct" type="number" step="0.01" min={0.01} max={100} defaultValue={venue.advance_pct} required info="The percentage of the total booking cost required upfront to secure the reservation." />
                  <Input label="Balance Due (Days before event)" name="balance_due" type="number" min={1} defaultValue={venue.balance_due_days_before_event} required info="The number of days prior to the event date when the remaining balance must be paid in full." />
                </div>
              </div>
            </div>
          )}

          {editSection === 'photos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-end pb-2">
                <div className="relative">
                  {isEditing && (
                    <>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={async (e) => {
                          const files = e.target.files
                          if (!files || files.length === 0 || !venueId) return
                          
                          setSaving(true)
                          try {
                            const newPhotos: VenuePhoto[] = []
                            const client = createClient()

                            for (let i = 0; i < files.length; i++) {
                              const formData = new FormData()
                              formData.append('file', files[i])
                              const newPhoto = await venueEndpoints(client).addVenuePhoto(venueId, formData)
                              newPhotos.push(newPhoto)
                            }

                            setVenue(prev => prev ? ({
                              ...prev,
                              photos: [...(prev.photos ?? []), ...newPhotos]
                            }) : null)
                          } catch (err) {
                            console.error('Failed to upload photos', err)
                            toast.error('Upload failed for one or more images. Ensure they are valid images.')
                          } finally {
                            setSaving(false)
                            e.target.value = '' // reset input
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                        disabled={saving}
                      />
                      <Button variant="secondary" type="button" disabled={saving}>
                        {saving ? 'Uploading...' : 'Upload Photos'}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {(!localPhotos || localPhotos.length === 0) ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-ink-800 rounded-xl bg-zinc-50 dark:bg-ink-800">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">No photos uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {localPhotos.map((photo, index) => (
                    <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-zinc-200/60 aspect-video bg-zinc-100 dark:bg-ink-800 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 ring-1 ring-zinc-900/5">
                      <img src={photo.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Venue" />
                      
                      {/* Subtle top gradient for badge contrast */}
                      {index === 0 && (
                        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent z-[5] pointer-events-none" />
                      )}

                      {/* Cover Badge */}
                      {index === 0 && (
                        <div className="absolute top-3 left-3 bg-zinc-900/70 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 z-10 tracking-wide">
                          <Icons.Star className="w-3.5 h-3.5 fill-white text-white" />
                          <span>COVER PHOTO</span>
                        </div>
                      )}

                      {/* Controls overlay - only show if editing */}
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                          {/* Center "Make Cover" Button */}
                          {index !== 0 && (
                            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[1px]">
                              <button type="button" onClick={() => makeCover(index)} className="bg-white dark:bg-ink-900 text-zinc-900 dark:text-zinc-100 text-sm font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-brand hover:text-white hover:scale-105 transition-all duration-200 flex items-center gap-2">
                                <Icons.Image className="w-4 h-4" />
                                Make Cover
                              </button>
                            </div>
                          )}

                          {/* Top Right Trash Button */}
                          <button
                            type="button"
                            onClick={async () => {
                              if (!(await confirmAction("Are you sure you want to delete this photo?"))) return
                              if (!venueId) return
                              setSaving(true)
                              try {
                                const client = createClient()
                                await venueEndpoints(client).deleteVenuePhoto(venueId, photo.id)
                                setLocalPhotos(prev => prev.filter(p => p.id !== photo.id))
                                setVenue(prev => prev ? ({
                                  ...prev,
                                  photos: prev.photos?.filter(p => p.id !== photo.id)
                                }) : null)
                              } catch (err) {
                                console.error('Failed to delete photo', err)
                                toast.error('Deletion failed.')
                              } finally {
                                setSaving(false)
                              }
                            }}
                            className="absolute top-3 right-3 bg-red-600/90 text-white p-2 rounded-full hover:bg-red-600 shadow-md transition-all hover:scale-110 disabled:opacity-50"
                            title="Delete Photo"
                            disabled={saving}
                          >
                            <Icons.Trash2 className="w-4 h-4" />
                          </button>

                          {/* Bottom Center Move Controls */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-zinc-900/80 backdrop-blur-md rounded-full p-1 shadow-lg border border-white/10">
                            <button 
                              type="button" 
                              onClick={() => movePhoto(index, -1)} 
                              disabled={index === 0} 
                              className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move Left"
                            >
                              <Icons.ChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => movePhoto(index, 1)} 
                              disabled={index === localPhotos.length - 1} 
                              className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move Right"
                            >
                              <Icons.ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {editSection === 'amenities' && (
            <div className="space-y-4">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Select Amenities</h4>
              {platformAmenities.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">Loading amenities...</p>
              ) : !isEditing && selectedAmenities.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-ink-800 rounded-xl bg-zinc-50 dark:bg-ink-800">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">No amenities selected.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {platformAmenities
                    .filter(amenity => isEditing || selectedAmenities.includes(amenity.id))
                    .map(amenity => {
                    const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[amenity.icon || 'Check'] ?? Icons.Check
                    const isSelected = selectedAmenities.includes(amenity.id)
                    
                    return (
                      <label 
                        key={amenity.id} 
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected ? 'border-brand bg-brand/5' : 'border-zinc-200 dark:border-ink-800 hover:bg-zinc-50 dark:hover:bg-ink-800 dark:bg-ink-800'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAmenities(prev => [...prev, amenity.id])
                            } else {
                              setSelectedAmenities(prev => prev.filter(id => id !== amenity.id))
                            }
                          }}
                          className="rounded text-brand focus:ring-brand sr-only" 
                        />
                        <Icon className={`h-5 w-5 ${isSelected ? 'text-brand' : 'text-zinc-400 dark:text-zinc-500'}`} />
                        <span className={`text-sm font-medium ${isSelected ? 'text-brand-hover' : 'text-zinc-700 dark:text-zinc-300 dark:text-zinc-600'}`}>
                          {amenity.name}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {editSection === 'policies' && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Refund Tiers</h4>
                <InfoTooltip content="Define your cancellation refund tiers. The hours must be in descending order (e.g. 168 hours = 7 days, 72 hours = 3 days)." />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 items-end bg-zinc-50 dark:bg-ink-800 p-4 rounded-lg border border-zinc-200 dark:border-ink-800">
                  <HoursToDaysInput label="Tier 1: Cancel before (Hours)" name="tier_1_hours" type="number" min={1} defaultValue={venue.cancellation_policy?.tier_1_hours || ''} placeholder="e.g. 168" />
                  <Input label="Refund %" name="tier_1_refund_pct" type="number" step="0.01" min="0" max="100" defaultValue={venue.cancellation_policy?.tier_1_refund_pct || ''} placeholder="e.g. 100" />
                </div>

                <div className="grid grid-cols-2 gap-4 items-end bg-zinc-50 dark:bg-ink-800 p-4 rounded-lg border border-zinc-200 dark:border-ink-800">
                  <HoursToDaysInput label="Tier 2: Cancel before (Hours)" name="tier_2_hours" type="number" min={1} defaultValue={venue.cancellation_policy?.tier_2_hours || ''} placeholder="e.g. 72" />
                  <Input label="Refund %" name="tier_2_refund_pct" type="number" step="0.01" min="0" max="100" defaultValue={venue.cancellation_policy?.tier_2_refund_pct || ''} placeholder="e.g. 50" />
                </div>

                <div className="grid grid-cols-2 gap-4 items-end bg-zinc-50 dark:bg-ink-800 p-4 rounded-lg border border-zinc-200 dark:border-ink-800">
                  <HoursToDaysInput label="Tier 3: Cancel before (Hours) (Optional)" name="tier_3_hours" type="number" min={1} defaultValue={venue.cancellation_policy?.tier_3_hours || ''} placeholder="e.g. 24" />
                  <Input label="Refund % (Optional)" name="tier_3_refund_pct" type="number" step="0.01" min="0" max="100" defaultValue={venue.cancellation_policy?.tier_3_refund_pct || ''} placeholder="e.g. 25" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-100 dark:border-ink-800">
                <Input label="No Show Refund (%)" name="no_show_refund_pct" type="number" step="0.01" min="0" max="100" required defaultValue={venue.cancellation_policy?.no_show_refund_pct || '0'} info="The percentage of the collected amount (excluding platform fees) refunded if the customer cancels late or fails to show up." />
                <Input label="Overdue Advance Refund (%)" name="overdue_advance_refund_pct" type="number" step="0.01" min="0" max="100" required defaultValue={venue.overdue_advance_refund_pct || '0'} info="The percentage of the advance deposit refunded to the customer if you choose to issue a Goodwill Cancellation when they fail to pay their balance on time." />
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-ink-800">
                <label className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1">
                  Additional Policy Notes (Optional)
                  <InfoTooltip content="Any extra rules, exceptions, or specific conditions regarding cancellations and refunds (e.g., weather policies, rescheduling rules)." />
                </label>
                <textarea 
                  name="notes"
                  defaultValue={venue.cancellation_policy?.notes || ''}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-ink-800 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="e.g. In case of severe weather, full refunds are provided regardless of the cancellation window."
                />
              </div>
            </div>
          )}

          {editSection === 'operating-hours' && (
            <div className="space-y-6">
              <div className="space-y-6">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Base Schedule</h4>
                <div className="grid grid-cols-2 gap-4">
                  <TimeSelect label="Opening Time" name="open_time" value={venue.open_time || ''} onChange={e => setVenue(prev => prev ? { ...prev, open_time: e.target.value } : null)} required />
                  <TimeSelect label="Closing Time" name="close_time" value={venue.close_time || ''} onChange={e => setVenue(prev => prev ? { ...prev, close_time: e.target.value } : null)} required />
                </div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600">
                  <input type="checkbox" name="spans_next_day" defaultChecked={venue.spans_next_day} className="rounded text-brand focus:ring-brand" />
                  Operating hours span into the next day (e.g., closes after midnight)
                </label>
              </div>
            </div>
          )}
          </div>
        </Card>
      </form>
    </div>
  )
}
