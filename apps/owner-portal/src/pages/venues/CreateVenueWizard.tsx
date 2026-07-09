import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, Input, SectionHeader, LocationPickerMap, InfoTooltip, Select } from '@venue404/ui'
import * as Icons from 'lucide-react'
import { createClient, venueEndpoints } from '@venue404/api-client'
import type { VenuePhoto } from '@venue404/api-client'
import { useQuery } from '@tanstack/react-query'
import { StateSelect } from '../../components/StateSelect'
import { DurationInput } from '../../components/DurationInput'
import { TimeSelect } from '../../components/TimeSelect'
import toast from 'react-hot-toast'
import { confirmAction } from '../../lib/confirm'

const STEPS = [
  'Basic Details',
  'Photos',
  'Operating Hours',
  'Booking Settings',
  'Pricing',
  'Cancellation Policy',
  'Amenities',
  'Review & Submit'
]

export default function CreateVenueWizard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [venueId, setVenueId] = useState<string | null>(searchParams.get('id'))
  const [currentStep, setCurrentStep] = useState(() => {
    const step = searchParams.get('step')
    return step ? parseInt(step, 10) - 1 : 0
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const showError = (msg: string) => {
    setError(msg)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 10)
  }

  // Centralized state for the entire form
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    min_capacity: '',
    max_capacity: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: 'India',
    postal_code: '',
    latitude: null as number | null,
    longitude: null as number | null,
    open_time: '09:00',
    close_time: '23:00',
    min_booking_duration_minutes: 60,
    max_booking_duration_minutes: 1440,
    slot_interval_minutes: 30,
    pre_buffer_minutes: 30,
    post_buffer_minutes: 30,
    pricing_mode: 'flat',
    base_price: '',
    hourly_rate: '',
    advance_pct: 30,
    balance_due: 7,
    spans_next_day: false,
    allowed_booking_types: ['full_day', 'time_slot'],
    owner_action_window_hours: 48,
    overdue_advance_refund_pct: 0,
    min_price_pct: 50,
    max_price_pct: 200,
    booking_mode: 'MANUAL',
    tier_1_hours: '168', // 7 days
    tier_1_refund_pct: '100',
    tier_2_hours: '72', // 3 days
    tier_2_refund_pct: '50',
    tier_3_hours: '',
    tier_3_refund_pct: '',
    no_show_refund_pct: '0',
    notes: '',
  })

  const [photos, setPhotos] = useState<File[]>([])
  const [existingPhotos, setExistingPhotos] = useState<VenuePhoto[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const { data: platformAmenities = [] } = useQuery({
    queryKey: ['platform-amenities'],
    queryFn: async () => venueEndpoints(createClient()).getPlatformAmenities()
  })

  const { data: venueCategories = [] } = useQuery({
    queryKey: ['venue-categories'],
    queryFn: async () => venueEndpoints(createClient()).getVenueCategories()
  })

  const { data: draftVenue, isLoading: isLoadingDraft = !!venueId } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      if (!venueId) return null
      return venueEndpoints(createClient()).getMyVenue(venueId)
    },
    enabled: !!venueId,
  })

  useEffect(() => {
    if (draftVenue) {
      const data = draftVenue
      setFormData(prev => ({
        ...prev,
        name: data.name || '',
        category_id: data.category?.id || '',
        description: data.description || '',
        min_capacity: data.min_capacity?.toString() || '',
        max_capacity: data.max_capacity?.toString() || '',
        address_line1: data.address_line1 || '',
        address_line2: data.address_line2 || '',
        city: data.city || '',
        state: data.state || '',
        country: data.country || 'India',
        postal_code: data.postal_code || '',
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
        open_time: data.open_time ? data.open_time.slice(0, 5) : '09:00',
        close_time: data.close_time ? data.close_time.slice(0, 5) : '23:00',
        min_booking_duration_minutes: data.min_booking_duration_minutes || 60,
        max_booking_duration_minutes: data.max_booking_duration_minutes || 1440,
        slot_interval_minutes: data.slot_interval_minutes || 30,
        pre_buffer_minutes: data.pre_buffer_minutes || 30,
        post_buffer_minutes: data.post_buffer_minutes || 30,
        pricing_mode: data.pricing_mode || 'flat',
        base_price: data.starting_price_paise ? (data.starting_price_paise / 100).toString() : '',
        hourly_rate: data.hourly_rate_paise ? (data.hourly_rate_paise / 100).toString() : '',
        advance_pct: data.advance_pct ? parseFloat(String(data.advance_pct)) : 30,
        balance_due: data.balance_due_days_before_event || 7,
        spans_next_day: data.spans_next_day || false,
        allowed_booking_types: data.allowed_booking_types || ['full_day', 'time_slot'],
        owner_action_window_hours: data.owner_action_window_hours || 48,
        overdue_advance_refund_pct: data.overdue_advance_refund_pct ? parseFloat(data.overdue_advance_refund_pct) : 0,
        min_price_pct: data.min_price_pct ? parseFloat(String(data.min_price_pct)) : 50,
        max_price_pct: data.max_price_pct ? parseFloat(String(data.max_price_pct)) : 200,
        booking_mode: data.booking_mode || 'MANUAL',
        
        tier_1_hours: data.cancellation_policy?.tier_1_hours?.toString() || '',
        tier_1_refund_pct: data.cancellation_policy?.tier_1_refund_pct?.toString() || '',
        tier_2_hours: data.cancellation_policy?.tier_2_hours?.toString() || '',
        tier_2_refund_pct: data.cancellation_policy?.tier_2_refund_pct?.toString() || '',
        tier_3_hours: data.cancellation_policy?.tier_3_hours?.toString() || '',
        tier_3_refund_pct: data.cancellation_policy?.tier_3_refund_pct?.toString() || '',
        no_show_refund_pct: data.cancellation_policy?.no_show_refund_pct?.toString() || '0',
        notes: data.cancellation_policy?.notes || '',
      }))

      if (data.amenities) {
        setSelectedAmenities(data.amenities.map(a => a.id))
      }
      
      if (data.photos) {
        setExistingPhotos(data.photos)
      }
    }
  }, [draftVenue])

  useEffect(() => {
    const hasFullDay = formData.allowed_booking_types.includes('full_day')
    const hasTimeSlot = formData.allowed_booking_types.includes('time_slot')
    
    if (hasFullDay && !hasTimeSlot && formData.pricing_mode !== 'flat') {
      setFormData(prev => ({ ...prev, pricing_mode: 'flat' }))
    } else if (!hasFullDay && hasTimeSlot && formData.pricing_mode !== 'hourly') {
      setFormData(prev => ({ ...prev, pricing_mode: 'hourly' }))
    } else if (hasFullDay && hasTimeSlot && formData.pricing_mode !== 'mixed') {
      setFormData(prev => ({ ...prev, pricing_mode: 'mixed' }))
    }
  }, [formData.allowed_booking_types, formData.pricing_mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleBookingTypeToggle = (type: string) => {
    setFormData(prev => {
      const types = prev.allowed_booking_types as string[]
      return {
        ...prev,
        allowed_booking_types: types.includes(type)
          ? types.filter(t => t !== type)
          : [...types, type]
      }
    })
  }

  const handleNext = async () => {
    setError(null)
    
    // Step 0: Basic Details Validation
    if (currentStep === 0) {
      if (!formData.category_id) {
        showError("Please select a Venue Category.")
        return
      }
      if (formData.min_capacity && formData.max_capacity) {
        if (parseInt(formData.min_capacity.toString(), 10) > parseInt(formData.max_capacity.toString(), 10)) {
          showError("Min Capacity cannot exceed Max Capacity.")
          return
        }
      }
    }
    
    // Step 2: Operating Hours Validation
    if (currentStep === 2) {
      if (!formData.spans_next_day) {
        // Simple string comparison works because formats are zero-padded (e.g. 09:00 vs 17:00)
        if (formData.close_time <= formData.open_time) {
          showError("Closing time must be after opening time unless 'Closes next day' is checked.")
          return
        }
      }
    }
    // Step 3: Booking Settings Validation
    if (currentStep === 3) {
      if (formData.min_booking_duration_minutes && formData.max_booking_duration_minutes) {
        if (parseInt(formData.min_booking_duration_minutes.toString(), 10) > parseInt(formData.max_booking_duration_minutes.toString(), 10)) {
          showError("Min Booking Duration cannot exceed Max Booking Duration.")
          return
        }
      }
    }

    // Step 4: Pricing Validation
    if (currentStep === 4) {
      if ((formData.pricing_mode === 'flat' || formData.pricing_mode === 'mixed') && !formData.base_price) {
        showError("Please enter a Base Price.")
        return
      }
      if ((formData.pricing_mode === 'hourly' || formData.pricing_mode === 'mixed') && !formData.hourly_rate) {
        showError("Please enter an Hourly Rate.")
        return
      }
      if (formData.min_price_pct && formData.max_price_pct) {
        if (parseFloat(formData.min_price_pct.toString()) > parseFloat(formData.max_price_pct.toString())) {
          showError("Min Price % cannot exceed Max Price %.")
          return
        }
      }
    }

    // Step 5: Cancellation Policy Validation
    if (currentStep === 5) {
      const t1h = formData.tier_1_hours
      const t1p = formData.tier_1_refund_pct
      const t2h = formData.tier_2_hours
      const t2p = formData.tier_2_refund_pct
      const t3h = formData.tier_3_hours
      const t3p = formData.tier_3_refund_pct

      // Pairing checks
      if ((t1h && t1p === '') || (!t1h && t1p !== '')) {
        showError("Tier 1: Hours and Refund % must both be filled or both be empty.")
        return
      }
      if ((t2h && t2p === '') || (!t2h && t2p !== '')) {
        showError("Tier 2: Hours and Refund % must both be filled or both be empty.")
        return
      }
      if ((t3h && t3p === '') || (!t3h && t3p !== '')) {
        showError("Tier 3: Hours and Refund % must both be filled or both be empty.")
        return
      }

      // Descending checks
      const t1hv = t1h ? parseInt(t1h.toString(), 10) : null
      const t2hv = t2h ? parseInt(t2h.toString(), 10) : null
      const t3hv = t3h ? parseInt(t3h.toString(), 10) : null

      if (t1hv !== null && t2hv !== null && t1hv <= t2hv) {
        showError("Tier 1 hours must be strictly greater than Tier 2 hours.")
        return
      }
      if (t2hv !== null && t3hv !== null && t2hv <= t3hv) {
        showError("Tier 2 hours must be strictly greater than Tier 3 hours.")
        return
      }
    }

    if (currentStep < STEPS.length - 1) {
      const payload = buildPayload()
      payload.last_completed_step = currentStep + 1

      try {
        setSubmitting(true)
        const client = createClient()
        let activeVenueId = venueId

        if (!venueId && currentStep === 0) {
          const newVenue = await venueEndpoints(client).createVenue(payload)
          setVenueId(newVenue.id)
          activeVenueId = newVenue.id
        } else if (venueId) {
          await venueEndpoints(client).updateVenue(venueId, payload)
          if (payload.cancellation_policy) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await venueEndpoints(client).updateCancellationPolicy(venueId, payload.cancellation_policy as any)
          }
          if (payload.amenity_ids) {
            await venueEndpoints(client).updateVenueAmenities(venueId, { amenity_ids: payload.amenity_ids as string[] })
          } else {
            await venueEndpoints(client).updateVenueAmenities(venueId, { amenity_ids: [] })
          }
        }

        if (activeVenueId) {
          setSearchParams({ id: activeVenueId, step: (currentStep + 2).toString() })
        }

        // Upload photos if we are on the Photos step
        if (currentStep === 1 && photos.length > 0 && activeVenueId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const successfullyUploaded: any[] = []
          for (const file of photos) {
            try {
              const fd = new FormData()
              fd.append('file', file)
              const newPhoto = await venueEndpoints(client).addVenuePhoto(activeVenueId, fd)
              successfullyUploaded.push(newPhoto)
            } catch (err) {
              console.error('Failed to upload a photo', err)
            }
          }
          setExistingPhotos(prev => [...prev, ...successfullyUploaded])
          // Clear local photos array so we don't upload them again
          setPhotos([])
        }

        setCurrentStep(s => s + 1)
      } catch (err: unknown) {
        showError(err instanceof Error ? err.message : 'Failed to save draft.')
        return
      } finally {
        setSubmitting(false)
      }
    } else {
      submitVenue()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1)
    } else {
      navigate('/venues')
    }
  }

  const buildPayload = () => {
    const payload: Record<string, unknown> = {
      name: formData.name,
      description: formData.description || null,
      category_id: formData.category_id || null,
      address_line1: formData.address_line1 || 'TBD',
      address_line2: formData.address_line2 || null,
      city: formData.city || 'TBD',
      state: formData.state || 'TBD',
      country: formData.country || 'India',
      postal_code: formData.postal_code || null,
      latitude: formData.latitude,
      longitude: formData.longitude,
      timezone: 'Asia/Kolkata',
      min_capacity: formData.min_capacity ? parseInt(formData.min_capacity.toString(), 10) : null,
      max_capacity: formData.max_capacity ? parseInt(formData.max_capacity.toString(), 10) : 100,
      open_time: formData.open_time.split(':').length === 2 ? `${formData.open_time}:00` : formData.open_time,
      close_time: formData.close_time.split(':').length === 2 ? `${formData.close_time}:00` : formData.close_time,
      spans_next_day: formData.spans_next_day,
      allowed_booking_types: formData.allowed_booking_types.length > 0 ? formData.allowed_booking_types : ['full_day', 'time_slot'],
      min_booking_duration_minutes: parseInt(formData.min_booking_duration_minutes.toString(), 10),
      max_booking_duration_minutes: parseInt(formData.max_booking_duration_minutes.toString(), 10),
      slot_interval_minutes: parseInt(formData.slot_interval_minutes.toString(), 10),
      pre_buffer_minutes: parseInt(formData.pre_buffer_minutes.toString(), 10),
      post_buffer_minutes: parseInt(formData.post_buffer_minutes.toString(), 10),
      pricing_mode: formData.pricing_mode,
      starting_price_paise: (formData.pricing_mode === 'flat' || formData.pricing_mode === 'mixed') ? parseInt(formData.base_price.toString() || '0', 10) * 100 : null,
      hourly_rate_paise: (formData.pricing_mode === 'hourly' || formData.pricing_mode === 'mixed') ? parseInt(formData.hourly_rate.toString() || '0', 10) * 100 : null,
      advance_pct: parseFloat(formData.advance_pct.toString()),
      balance_due_days_before_event: parseInt(formData.balance_due.toString(), 10),
      owner_action_window_hours: parseInt(formData.owner_action_window_hours.toString(), 10),
      overdue_advance_refund_pct: parseFloat(formData.overdue_advance_refund_pct.toString()),
      min_price_pct: parseFloat(formData.min_price_pct.toString()),
      max_price_pct: parseFloat(formData.max_price_pct.toString()),
      booking_mode: formData.booking_mode
    }

    if (selectedAmenities.length > 0) {
      payload.amenity_ids = selectedAmenities
    }

    const policyPayload: Record<string, unknown> = {
      no_show_refund_pct: parseFloat(formData.no_show_refund_pct.toString() || '0'),
      platform_fee_refundable: false,
      notes: formData.notes || null,
    }
    if (formData.tier_1_hours && formData.tier_1_refund_pct !== '') {
      policyPayload.tier_1_hours = parseInt(formData.tier_1_hours.toString(), 10)
      policyPayload.tier_1_refund_pct = parseFloat(formData.tier_1_refund_pct.toString())
    }
    if (formData.tier_2_hours && formData.tier_2_refund_pct !== '') {
      policyPayload.tier_2_hours = parseInt(formData.tier_2_hours.toString(), 10)
      policyPayload.tier_2_refund_pct = parseFloat(formData.tier_2_refund_pct.toString())
    }
    if (formData.tier_3_hours && formData.tier_3_refund_pct !== '') {
      policyPayload.tier_3_hours = parseInt(formData.tier_3_hours.toString(), 10)
      policyPayload.tier_3_refund_pct = parseFloat(formData.tier_3_refund_pct.toString())
    }
    
    payload.cancellation_policy = policyPayload

    return payload
  }

  const submitVenue = async () => {
    setSubmitting(true)
    setError(null)

    try {
      const client = createClient()
      const payload = buildPayload()
      payload.last_completed_step = 8

      if (venueId) {
        await venueEndpoints(client).updateVenue(venueId, payload)
        if (payload.cancellation_policy) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await venueEndpoints(client).updateCancellationPolicy(venueId, payload.cancellation_policy as any)
        }
        if (payload.amenity_ids) {
          await venueEndpoints(client).updateVenueAmenities(venueId, { amenity_ids: payload.amenity_ids as string[] })
        } else {
          await venueEndpoints(client).updateVenueAmenities(venueId, { amenity_ids: [] })
        }
        navigate(`/venues/${venueId}/overview`)
      } else {
        const newVenue = await venueEndpoints(client).createVenue(payload)
        navigate(`/venues/${newVenue.id}/overview`)
      }
    } catch (err: unknown) {
      console.error('Failed to submit venue', err)
      showError(err instanceof Error ? err.message : 'Failed to submit venue. Check your inputs.')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoadingDraft) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Wizard Header */}
      <div className="mb-8 flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:text-zinc-100 transition-colors"
        >
          <Icons.ArrowLeft className="h-4 w-4" />
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </button>
        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">
          Step {currentStep + 1} of {STEPS.length}
        </div>
      </div>

      <SectionHeader 
        title={STEPS[currentStep]} 
        description="Fill out the details below. You can save as a draft and return later." 
      />

      {/* Progress Bar */}
      <div className="flex flex-wrap items-center gap-y-4 gap-x-2 mb-8 mt-6 pb-2">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          return (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                isCompleted ? 'bg-emerald-500 text-white' :
                isCurrent ? 'bg-brand text-white' : 'bg-zinc-100 dark:bg-ink-800 text-zinc-400 dark:text-zinc-500'
              }`}>
                {isCompleted ? <Icons.Check className="h-3 w-3" /> : index + 1}
              </div>
              <span className={`text-sm font-medium ${isCurrent ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'}`}>
                {step}
              </span>
              {index < STEPS.length - 1 && (
                <Icons.ChevronRight className="h-4 w-4 text-zinc-200 mx-1" />
              )}
            </div>
          )
        })}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Step Content */}
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
        <Card className="p-8">
          {currentStep === 0 && (
            <div className="space-y-6">
              <Input label="Venue Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Skyline Rooftop" required />
              <div className="space-y-1">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600">Venue Category<span className="text-red-500 ml-1">*</span></label>
                <Select
                  value={formData.category_id}
                  onChange={(val) => setFormData(prev => ({ ...prev, category_id: val }))}
                  options={venueCategories.map(cat => ({ label: `${cat.icon ? `${cat.icon} ` : ''}${cat.label}`, value: cat.id }))}
                  placeholder={venueCategories.length === 0 ? 'Loading categories...' : 'Select a category...'}
                  disabled={venueCategories.length === 0}
                />
              </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-ink-800 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                placeholder="Describe your venue..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Min Capacity" name="min_capacity" type="number" min={1} value={formData.min_capacity} onChange={handleChange} placeholder="e.g. 50" />
              <Input label="Max Capacity" name="max_capacity" type="number" min={1} required value={formData.max_capacity} onChange={handleChange} placeholder="e.g. 300" />
            </div>
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-ink-800">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Location</h4>
              <Input label="Address Line 1" name="address_line1" required value={formData.address_line1} onChange={handleChange} placeholder="Street address" />
              <Input label="Address Line 2" name="address_line2" value={formData.address_line2} onChange={handleChange} placeholder="Suite, floor, etc. (optional)" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" name="city" required value={formData.city} onChange={handleChange} />
                <StateSelect 
                  value={formData.state} 
                  onChange={(val) => setFormData(prev => ({ ...prev, state: val }))} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Country" name="country" required value="India" disabled />
                <Input label="Postal Code" name="postal_code" value={formData.postal_code} onChange={handleChange} />
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1">Pinpoint Location on Map</label>
                <LocationPickerMap
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onChange={(lat, lng, addr) => {
                    setFormData(prev => {
                      const update = { ...prev, latitude: lat, longitude: lng }
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

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-ink-800 rounded-xl bg-zinc-50 dark:bg-ink-800 relative">
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Upload Photos</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mt-1">Drag and drop images here, or click to browse.</p>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setPhotos(prev => [...prev, ...Array.from(e.target.files!)])
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Button variant="secondary" className="mt-4 pointer-events-none">Select Images</Button>
            </div>

            {/* Existing Photos from Backend */}
            {existingPhotos.length > 0 && (
              <div className="space-y-2 mt-8">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Already Uploaded</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingPhotos.map((photo) => (
                    <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-ink-800 aspect-video bg-zinc-100 dark:bg-ink-800">
                      <img src={photo.image_url} className="w-full h-full object-cover" alt="Venue Photo" />
                      <button
                        type="button"
                        onClick={async () => {
                          if (venueId) {
                            const confirmed = await confirmAction('Are you sure you want to delete this photo?')
                            if (confirmed) {
                              try {
                                const client = createClient()
                                await venueEndpoints(client).deleteVenuePhoto(venueId, photo.id)
                                setExistingPhotos(prev => prev.filter(p => p.id !== photo.id))
                              } catch (err) {
                                console.error('Failed to delete photo', err)
                                toast.error('Failed to delete photo')
                              }
                            }
                          }
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Photos to be uploaded */}
            {photos.length > 0 && (
              <div className="space-y-2 mt-8">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">New Photos (Ready to upload)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photos.map((file, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-ink-800 aspect-video bg-zinc-100 dark:bg-ink-800">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                      <button
                        type="button"
                        onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
            <div className="space-y-6 max-w-md">
              <TimeSelect label="Opening Time" name="open_time" required value={formData.open_time} onChange={handleChange} />
              <TimeSelect label="Closing Time" name="close_time" required value={formData.close_time} onChange={handleChange} />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="spans_next_day" checked={formData.spans_next_day} onChange={handleChange} className="rounded text-brand focus:ring-brand" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300 dark:text-zinc-600">Closes next day</span>
              </label>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 italic mt-4">Per-day overrides can be set after creating the venue.</p>
            </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Allowed Booking Types</h4>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 cursor-pointer">
                  <input type="checkbox" checked={formData.allowed_booking_types.includes('full_day')} onChange={() => handleBookingTypeToggle('full_day')} className="rounded text-brand focus:ring-brand w-4 h-4" />
                  Full Day
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 cursor-pointer">
                  <input type="checkbox" checked={formData.allowed_booking_types.includes('time_slot')} onChange={() => handleBookingTypeToggle('time_slot')} className="rounded text-brand focus:ring-brand w-4 h-4" />
                  Time Slot
                </label>
              </div>
            </div>

            <div className="space-y-8 pt-6 border-t border-zinc-100 dark:border-ink-800">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Booking Limits & Buffers</h4>
              
              <div className="space-y-6 max-w-3xl">
                <div className="grid md:grid-cols-2 gap-12">
                  <DurationInput label="Min Booking Duration" name="min_booking_duration_minutes" required value={formData.min_booking_duration_minutes} onChange={handleChange} info="The shortest allowed duration for a time-slot booking." />
                  <DurationInput label="Max Booking Duration" name="max_booking_duration_minutes" required value={formData.max_booking_duration_minutes} onChange={handleChange} info="The longest allowed duration for a time-slot booking." />
                </div>
                
                <div className="grid md:grid-cols-2 gap-12 pt-4 border-t border-zinc-50">
                  <DurationInput label="Slot Interval" name="slot_interval_minutes" required value={formData.slot_interval_minutes} onChange={handleChange} helperText="e.g. 30 means bookings start at :00 and :30" info="The intervals at which bookings can start. For example, a 30-minute interval means bookings can start at 9:00, 9:30, 10:00, etc." />
                </div>
                
                <div className="grid md:grid-cols-2 gap-12 pt-4 border-t border-zinc-50">
                  <DurationInput label="Pre-Buffer (Setup time)" name="pre_buffer_minutes" required value={formData.pre_buffer_minutes} onChange={handleChange} helperText="Gap required before a booking" info="Mandatory gap time added BEFORE a booking starts to allow for venue setup or cleaning." />
                  <DurationInput label="Post-Buffer (Teardown time)" name="post_buffer_minutes" required value={formData.post_buffer_minutes} onChange={handleChange} helperText="Gap required after a booking" info="Mandatory gap time added AFTER a booking ends to allow for teardown or buffer before the next client arrives." />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-ink-800">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Booking Mode</h4>
              <div className="flex gap-6 mt-2">
                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-zinc-200 dark:border-ink-800 bg-white dark:bg-ink-950 flex-1 hover:border-brand-300 transition-colors">
                  <input type="radio" name="booking_mode" value="MANUAL" checked={formData.booking_mode === 'MANUAL'} onChange={handleChange} className="mt-1 text-brand focus:ring-brand w-4 h-4" />
                  <div>
                    <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100">Request to Book (Manual)</span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mt-1">You must manually review and Accept/Reject each booking request.</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-zinc-200 dark:border-ink-800 bg-white dark:bg-ink-950 flex-1 hover:border-brand-300 transition-colors">
                  <input type="radio" name="booking_mode" value="INSTANT" checked={formData.booking_mode === 'INSTANT'} onChange={handleChange} className="mt-1 text-brand focus:ring-brand w-4 h-4" />
                  <div>
                    <span className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">Instant Booking <span className="px-1.5 py-0.5 bg-brand-100 text-brand-700 text-[10px] uppercase rounded font-bold tracking-wider">Recommended</span></span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mt-1">Customers can instantly secure dates. No manual approval required.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-ink-800">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Approval Settings</h4>
              <Input label="Owner Action Window (Hours)" name="owner_action_window_hours" type="number" min={24} max={72} required={formData.booking_mode === 'MANUAL'} disabled={formData.booking_mode === 'INSTANT'} value={formData.owner_action_window_hours} onChange={handleChange} helperText="How long you have to accept/reject a pending request before it auto-cancels." info="The maximum time you have to review and Accept/Reject a booking request. If no action is taken, the booking is automatically canceled." />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Base Price (₹)" name="base_price" type="number" min={0} required={formData.pricing_mode !== 'hourly'} disabled={formData.pricing_mode === 'hourly'} value={formData.base_price} onChange={handleChange} placeholder="e.g. 50000" info="The total price for a full day booking." />
              <Input label="Hourly Rate (₹)" name="hourly_rate" type="number" min={0} required={formData.pricing_mode !== 'flat'} disabled={formData.pricing_mode === 'flat'} value={formData.hourly_rate} onChange={handleChange} placeholder="e.g. 5000" info="The price per hour for short time-slot bookings." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Token Advance (%)" name="advance_pct" type="number" min={0.01} max={100} step="0.01" required value={formData.advance_pct} onChange={handleChange} info="The percentage of the total booking cost required upfront to secure the reservation." />
              <Input label="Balance Due (Days before event)" name="balance_due" type="number" min={1} required value={formData.balance_due} onChange={handleChange} info="The number of days prior to the event date when the remaining balance must be paid in full." />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Refund Tiers</h4>
              <InfoTooltip content="Define your cancellation refund tiers. The hours must be in descending order (e.g. 168 hours = 7 days, 72 hours = 3 days)." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Tier 1: Cancel before (Hours)" name="tier_1_hours" type="number" min={1} value={formData.tier_1_hours} onChange={handleChange} placeholder="e.g. 168" suffix={formData.tier_1_hours && Number(formData.tier_1_hours) > 0 ? `≈ ${parseFloat((Number(formData.tier_1_hours) / 24).toFixed(2))} days` : undefined} />
              <Input label="Refund %" name="tier_1_refund_pct" type="number" step="0.01" min={0} max={100} value={formData.tier_1_refund_pct} onChange={handleChange} placeholder="e.g. 100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Tier 2: Cancel before (Hours)" name="tier_2_hours" type="number" min={1} value={formData.tier_2_hours} onChange={handleChange} placeholder="e.g. 72" suffix={formData.tier_2_hours && Number(formData.tier_2_hours) > 0 ? `≈ ${parseFloat((Number(formData.tier_2_hours) / 24).toFixed(2))} days` : undefined} />
              <Input label="Refund %" name="tier_2_refund_pct" type="number" step="0.01" min={0} max={100} value={formData.tier_2_refund_pct} onChange={handleChange} placeholder="e.g. 50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Tier 3: Cancel before (Hours) (Optional)" name="tier_3_hours" type="number" min={1} value={formData.tier_3_hours} onChange={handleChange} placeholder="e.g. 24" suffix={formData.tier_3_hours && Number(formData.tier_3_hours) > 0 ? `≈ ${parseFloat((Number(formData.tier_3_hours) / 24).toFixed(2))} days` : undefined} />
              <Input label="Refund % (Optional)" name="tier_3_refund_pct" type="number" step="0.01" min={0} max={100} value={formData.tier_3_refund_pct} onChange={handleChange} placeholder="e.g. 25" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-ink-800">
              <Input label="No Show Refund (%)" name="no_show_refund_pct" type="number" step="0.01" min={0} max={100} required value={formData.no_show_refund_pct} onChange={handleChange} info="The percentage of the collected amount (excluding platform fees) refunded if the customer cancels late or fails to show up." />
              <Input label="Overdue Advance Refund (%)" name="overdue_advance_refund_pct" type="number" step="0.01" min={0} max={100} required value={formData.overdue_advance_refund_pct} onChange={handleChange} info="The percentage of the advance deposit refunded to the customer if you choose to issue a Goodwill Cancellation when they fail to pay their balance on time." />
            </div>
            <div className="pt-4 border-t border-zinc-100 dark:border-ink-800">
              <label className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1">
                Additional Policy Notes (Optional)
                <InfoTooltip content="Any extra rules, exceptions, or specific conditions regarding cancellations and refunds (e.g., weather policies, rescheduling rules)." />
              </label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-zinc-200 dark:border-ink-800 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                placeholder="e.g. In case of severe weather, full refunds are provided regardless of the cancellation window."
              />
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4">
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">Select Amenities</h4>
            {platformAmenities.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">Loading amenities...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platformAmenities.map(amenity => {
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

        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="p-6 bg-brand-light text-brand-hover rounded-xl text-center border border-brand-muted/30">
              <Icons.Check className="h-12 w-12 mx-auto text-brand mb-4" />
              <h3 className="text-xl font-semibold">Ready to Review!</h3>
              <p className="mt-2 text-sm max-w-sm mx-auto">Your initial setup is complete. Proceed to your venue workspace to review your details, add more photos, and submit it for admin approval when you are ready.</p>
            </div>
          </div>
        )}
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={handleBack} className={currentStep === 0 ? 'invisible' : ''}>
            Previous Step
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {currentStep === STEPS.length - 1 ? (submitting ? 'Loading...' : 'Review my venue setup') : (submitting ? 'Saving...' : 'Save & Continue')}
          </Button>
        </div>
      </form>
    </div>
  )
}
