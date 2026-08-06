import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
  Upload,
  Plus,
  X,
  MapPin,
  Building2,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Users,
  Clock,
  ArrowLeft,
  Phone,
  Pencil,
  CalendarClock,
  Settings,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  buildVenuePayload,
  createVenue,
  fetchVenueBySlug,
  fetchVenueFormCategories,
  fetchVenueFormCities,
  fetchVenueFormDistricts,
  parseVenueError,
  updateVenue,
  uploadVenueImage,
  venueImagesToFormState,
  venueToFormState,
  VENUE_BOOKING_TYPES,
  VENUE_STATUS_LABELS,
  VENUE_STATUS_STYLES,
} from "@/apis/venues"
import HourlySlotsTab from "@/apps/venue/components/HourlySlotsTab"
import SessionSlotsTab from "@/apps/venue/components/SessionSlotsTab"
import FullDaySlotsTab from "@/apps/venue/components/FullDaySlotsTab"
import ScheduleOverridesPanel from "@/apps/venue/components/ScheduleOverridesPanel"
import VenueSettingsTab from "@/apps/venue/components/VenueSettingsTab"

const EMPTY_FORM = {
  name: "",
  category: "",
  district: "",
  city: "",
  address: "",
  googleMapsUrl: "",
  description: "",
  capacity: "",
  bookingType: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
}

function fieldClass(disabled, extra = "input") {
  return `${extra} ${disabled ? "cursor-default bg-muted/40" : ""}`
}

export default function AddVenuePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { slug } = useParams()
  const isEditMode = Boolean(slug)

  const [venue, setVenue] = useState(null)
  const [categories, setCategories] = useState([])
  const [districts, setDistricts] = useState([])
  const [cities, setCities] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [loadingVenue, setLoadingVenue] = useState(isEditMode)
  const [optionsError, setOptionsError] = useState("")
  const [loadError, setLoadError] = useState("")

  const [isEditing, setIsEditing] = useState(!isEditMode)
  const [successMessage, setSuccessMessage] = useState("")

  const [amenityInput, setAmenityInput] = useState("")
  const [amenities, setAmenities] = useState([])

  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const [formData, setFormData] = useState(EMPTY_FORM)
  const [activeTab, setActiveTab] = useState(
    () => (location.state?.activeTab === "slots" ? "slots" : "details"),
  )

  const fieldsDisabled = isEditMode && !isEditing

  const applyVenueToForm = useCallback((nextVenue) => {
    setVenue(nextVenue)
    setFormData(venueToFormState(nextVenue))
    setAmenities(nextVenue.amenities ?? [])
    setImages(venueImagesToFormState(nextVenue.images ?? []))
  }, [])

  useEffect(() => {
    if (location.state?.activeTab === "slots") {
      setActiveTab("slots")
    }
  }, [location.state, slug])

  useEffect(() => {
    if (!location.state?.activeTab) return undefined

    window.history.replaceState({}, document.title)
    return undefined
  }, [location.state])

  useEffect(() => {
    const fetchData = async () => {
      setLoadingOptions(true)
      setOptionsError("")

      try {
        const [categoryData, districtData] = await Promise.all([
          fetchVenueFormCategories(),
          fetchVenueFormDistricts(),
        ])
        setCategories(categoryData)
        setDistricts(districtData)
      } catch {
        setOptionsError("Failed to load categories and districts.")
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!formData.district) {
      setCities([])
      return undefined
    }

    let cancelled = false

    const loadCities = async () => {
      try {
        const cityData = await fetchVenueFormCities(formData.district)
        if (!cancelled) setCities(cityData)
      } catch {
        if (!cancelled) setCities([])
      }
    }

    loadCities()
    return () => {
      cancelled = true
    }
  }, [formData.district])

  useEffect(() => {
    if (!isEditMode) return undefined

    let cancelled = false

    const loadVenue = async () => {
      setLoadingVenue(true)
      setLoadError("")

      try {
        const data = await fetchVenueBySlug(slug)
        if (!cancelled) applyVenueToForm(data)
      } catch (err) {
        if (!cancelled) setLoadError(parseVenueError(err))
      } finally {
        if (!cancelled) setLoadingVenue(false)
      }
    }

    loadVenue()
    return () => {
      cancelled = true
    }
  }, [slug, isEditMode, applyVenueToForm])



  const addAmenity = () => {
    if (!amenityInput.trim()) return

    if (amenities.includes(amenityInput.trim())) {
      setAmenityInput("")
      return
    }

    setAmenities((prev) => [...prev, amenityInput.trim()])
    setAmenityInput("")
  }

  const removeAmenity = (index) => {
    setAmenities((prev) => prev.filter((_, i) => i !== index))
  }

const handleImages = async (e) => {
  if (!e.target.files) return

  await uploadFiles(
    Array.from(e.target.files)
  )
}

  const uploadSingleImage = async (file) => {
    return uploadVenueImage(file)
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

const handleDrop = async (e) => {
  e.preventDefault()
  setIsDragging(false)

  const files = Array.from(
    e.dataTransfer.files
  ).filter((file) =>
    file.type.startsWith("image/")
  )

  await uploadFiles(files)
}

  const handleTabChange = (tab) => {
    if ((tab === "slots" || tab === "settings") && isEditing && venue) {
      applyVenueToForm(venue)
      setAmenityInput("")
      setSubmitError("")
      setIsEditing(false)
    }
    setActiveTab(tab)
  }

  const handleCancelEdit = () => {
    if (venue) applyVenueToForm(venue)
    setAmenityInput("")
    setSubmitError("")
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (isEditMode && isEditing) {
      handleCancelEdit()
      return
    }
    navigate(-1)
  }

  const handleSubmit = async () => {
    setSubmitError("")

    const missingFields = []
    if (!formData.name.trim()) missingFields.push("venue name")
    if (!formData.category) missingFields.push("category")
    if (!formData.bookingType) missingFields.push("booking type")
    if (!formData.capacity) missingFields.push("capacity")
    if (!formData.district) missingFields.push("district")
    if (!formData.city) missingFields.push("city")
    if (!formData.address.trim()) missingFields.push("address")
    if (!formData.description.trim()) missingFields.push("description")
    if (!formData.contactName.trim()) missingFields.push("contact person")
    if (!formData.contactPhone.trim()) missingFields.push("contact phone")
    if (!formData.contactEmail.trim()) missingFields.push("contact email")

    if (missingFields.length > 0) {
      setSubmitError(`Please fill in: ${missingFields.join(", ")}.`)
      return
    }

    setSubmitting(true)

    try {
      const payload = buildVenuePayload(formData, amenities, images)

      if (isEditMode) {
        const updated = await updateVenue(slug, payload)
        applyVenueToForm(updated)
        setIsEditing(false)
        setSuccessMessage("Venue updated successfully.")
        window.setTimeout(() => setSuccessMessage(""), 4000)

        if (updated.slug !== slug) {
          navigate(`/venue/venues/${updated.slug}`, { replace: true })
        }
      } else {
        const created = await createVenue(payload)
        navigate(`/venue/venues/${created.slug}`, {
          replace: true,
          state: { activeTab: "slots" },
        })
      }
    } catch (error) {
      setSubmitError(parseVenueError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const selectedCategory = categories.find(
    (item) => String(item.id) === String(formData.category),
  )
  const selectedCity = cities.find(
    (item) => String(item.id) === String(formData.city),
  )
  const selectedBookingType = VENUE_BOOKING_TYPES.find(
    (item) => item.value === formData.bookingType,
  )

  // Calculate Form Completion Progress
  const requiredFields = [
    formData.name,
    formData.category,
    formData.bookingType,
    formData.capacity,
    formData.district,
    formData.city,
    formData.address,
    formData.description,
  ]
  const completedRequired = requiredFields.filter((val) => val && val.toString().trim() !== "").length
  const totalRequired = requiredFields.length

  const totalSteps = totalRequired + 2 // 8 fields + amenities + images
  const completedSteps =
    completedRequired + (amenities.length > 0 ? 1 : 0) + (images.length > 0 ? 1 : 0)
  const progressPercent = Math.round((completedSteps / totalSteps) * 100)

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 14,
      },
    },
  }



const uploadFiles = async (files) => {
  setUploading(true)

  try {
    const uploadedImages = await Promise.all(
      files.map(async (file, index) => {
        const result = await uploadSingleImage(file)

        return {
          public_id: result.public_id,
          image_url: result.secure_url,
          is_cover: false,
          sort_order: images.length + index + 1,
        }
      }),
    )

    setImages((prev) => {
      const merged = [...prev, ...uploadedImages]

      if (merged.length > 0) {
        merged[0].is_cover = true
      }

      return merged
    })
  } catch (error) {
    setSubmitError(parseVenueError(error))
  } finally {
    setUploading(false)
  }
}




  if (isEditMode && loadingVenue) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse space-y-6 px-1 py-2">
        <div className="h-10 w-64 rounded-xl bg-muted/50" />
        <div className="h-96 rounded-2xl bg-muted/40" />
      </div>
    )
  }

  if (isEditMode && loadError) {
    return (
      <div className="mx-auto max-w-6xl px-1 py-2">
        <button
          type="button"
          onClick={() => navigate("/venue/venues")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to venues
        </button>
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </p>
      </div>
    )
  }

  const statusClass = venue
    ? VENUE_STATUS_STYLES[venue.status] ?? "bg-slate-100 text-slate-600 border-slate-200"
    : ""
  const statusLabel = venue
    ? VENUE_STATUS_LABELS[venue.status] ?? venue.status
    : ""

  return (
    <div className="max-w-6xl mx-auto py-2 px-1">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button
            type="button"
            onClick={() => navigate("/venue/venues")}
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-3 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Venues
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {isEditMode
                ? formData.name || venue?.name || "Venue Details"
                : "Add New Venue"}
            </h1>
            {isEditMode && venue && (
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass}`}
              >
                {statusLabel}
              </span>
            )}
            {isEditMode && venue && venue.is_active === false && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Not accepting bookings
              </span>
            )}
          </div>

          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            {isEditMode
              ? activeTab === "slots"
                ? "Configure opening hours and booking slots for this venue."
                : activeTab === "settings"
                  ? "Control whether your venue is accepting new bookings."
                : fieldsDisabled
                  ? "View your venue details. Click Edit to make changes."
                  : "Edit your venue details and save changes instantly."
              : "Create and publish a venue to showcase on our booking website."}
          </p>
        </div>

        {isEditMode && activeTab === "details" && fieldsDisabled && (
          <button
            type="button"
            onClick={() => {
              setSubmitError("")
              setSuccessMessage("")
              setIsEditing(true)
            }}
            className="inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Pencil size={16} />
            Edit venue
          </button>
        )}

        {/* Progress Tracker Widget */}
        {!isEditMode && (
        <div className="bg-white/80 border border-border/80 rounded-2xl p-4 shadow-sm backdrop-blur-sm min-w-[240px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Form Completion
            </span>
            <span className="text-sm font-bold text-primary">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-primary h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground mt-1 block">
            {completedSteps} of {totalSteps} details completed
          </span>
        </div>
        )}
      </div>

      {successMessage && (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {successMessage}
        </p>
      )}

      {optionsError && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {optionsError}
        </p>
      )}

      {isEditMode && (
        <div className="mb-6 flex gap-1 border-b border-border">
          <button
            type="button"
            onClick={() => handleTabChange("details")}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === "details"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("slots")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === "slots"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarClock size={16} />
            Slots
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("settings")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === "settings"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
      )}

      {isEditMode && activeTab === "settings" ? (
        <VenueSettingsTab
          venue={venue}
          onVenueUpdate={applyVenueToForm}
        />
      ) : isEditMode && activeTab === "slots" ? (
        (() => {
          const bookingType = venue?.booking_type ?? formData.bookingType
          if (!bookingType) {
            return (
              <div className="rounded-2xl border border-dashed border-border/80 bg-white/70 px-6 py-20 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CalendarClock size={28} />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-foreground">
                  Slot configuration
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Set the venue booking type on the Details tab to configure slots.
                </p>
              </div>
            )
          }

          return (
            <div className="space-y-8">
              {bookingType === "hourly" && <HourlySlotsTab venue={venue} />}
              {bookingType === "session" && <SessionSlotsTab venue={venue} />}
              {bookingType === "full_day" && <FullDaySlotsTab venue={venue} />}
              <ScheduleOverridesPanel venue={venue} bookingType={bookingType} />
            </div>
          )
        })()
      ) : (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
      >
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Section */}
          <motion.section
            variants={cardVariants}
            className="rounded-2xl border border-border/60 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-6">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">
                  Basic Information
                </h2>
                <p className="text-xs text-muted-foreground">
                  Identify your venue's core title, category, and target seating.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Venue Name */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  Venue Name <span className="text-accent font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Grand Palace Ballroom"
                  className={fieldClass(fieldsDisabled)}
                  value={formData.name}
                  disabled={fieldsDisabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  Category <span className="text-accent font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    className={`${fieldClass(fieldsDisabled)} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%235E6B5F%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1rem_center] bg-no-repeat pr-10`}
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      })
                    }
                    disabled={fieldsDisabled || loadingOptions}
                  >
                    <option value="">Select Category</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Booking Type */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  Booking Type <span className="text-accent font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    className={`${fieldClass(fieldsDisabled)} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%235E6B5F%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1rem_center] bg-no-repeat pr-10`}
                    value={formData.bookingType}
                    disabled={fieldsDisabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bookingType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Booking Type</option>
                    {VENUE_BOOKING_TYPES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Capacity */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  Capacity (Max Guests) <span className="text-accent font-bold">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g., 250"
                  min="1"
                  className={fieldClass(fieldsDisabled)}
                  value={formData.capacity}
                  disabled={fieldsDisabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </motion.section>

          {/* Location Section */}
          <motion.section
            variants={cardVariants}
            className="rounded-2xl border border-border/60 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-6">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <MapPin size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">
                  Location Information
                </h2>
                <p className="text-xs text-muted-foreground">
                  Help clients navigate to your venue location.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* District */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  District <span className="text-accent font-bold">*</span>
                </label>
                <select
                  className={fieldClass(fieldsDisabled)}
                  value={formData.district}
                  disabled={fieldsDisabled || loadingOptions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      district: e.target.value,
                      city: "",
                    })
                  }
                >
                  <option value="">Select district</option>
                  {districts.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  City <span className="text-accent font-bold">*</span>
                </label>
                <select
                  className={fieldClass(fieldsDisabled)}
                  value={formData.city}
                  disabled={fieldsDisabled || loadingOptions || !formData.district}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      city: e.target.value,
                    })
                  }
                >
                  <option value="">Select city</option>
                  {cities.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Address */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  Full Address <span className="text-accent font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 5th Avenue, Palace Road"
                  className={fieldClass(fieldsDisabled)}
                  value={formData.address}
                  disabled={fieldsDisabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              {/* Google Maps URL */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  Google Maps URL
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  className={fieldClass(fieldsDisabled)}
                  value={formData.googleMapsUrl}
                  disabled={fieldsDisabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      googleMapsUrl: e.target.value,
                    })
                  }
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Paste the Google Maps link so guests can get directions to your venue.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Contact Information Section */}
          <motion.section
            variants={cardVariants}
            className="rounded-2xl border border-border/60 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-6">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Phone size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-lg text-foreground">
                  Contact Information
                </h2>

                <p className="text-xs text-muted-foreground">
                  Booking inquiries and customer communication details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Contact Name */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  Contact Person
                </label>

                <input
                  type="text"
                  className={fieldClass(fieldsDisabled)}
                  placeholder="John Doe"
                  value={formData.contactName}
                  disabled={fieldsDisabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  Contact Phone
                </label>

                <input
                  type="tel"
                  className={fieldClass(fieldsDisabled)}
                  placeholder="+91 9876543210"
                  value={formData.contactPhone}
                  disabled={fieldsDisabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPhone: e.target.value,
                    })
                  }
                />
              </div>

              {/* Contact Email */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                  Contact Email
                </label>

                <input
                  type="email"
                  className={fieldClass(fieldsDisabled)}
                  placeholder="booking@venue.com"
                  value={formData.contactEmail}
                  disabled={fieldsDisabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactEmail: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </motion.section>

          {/* Description Section */}
          <motion.section
            variants={cardVariants}
            className="rounded-2xl border border-border/60 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-6">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">
                  Venue Details
                </h2>
                <p className="text-xs text-muted-foreground">
                  Provide an attractive description detailing key qualities and highlights.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90 mb-2 block">
                Description <span className="text-accent font-bold">*</span>
              </label>
              <textarea
                rows={5}
                className={`${fieldClass(fieldsDisabled)} resize-none`}
                placeholder="Write something engaging about the venue environment, availability, layout, acoustics, or parking..."
                value={formData.description}
                disabled={fieldsDisabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </motion.section>
        </div>

        {/* Sidebar Widgets (Column 3) */}
        <div className="space-y-6">
          {/* Real-time Summary Card Preview */}
          <motion.section
            variants={cardVariants}
            className="rounded-2xl border border-border/60 bg-white/80 backdrop-blur-sm p-5 shadow-sm overflow-hidden"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-2.5 py-1 bg-secondary rounded-full inline-block mb-4">
              Real-Time Preview
            </span>

            <div className="rounded-xl overflow-hidden border border-border/40 bg-card">
              {/* Preview Image */}
              <div className="h-44 bg-secondary relative flex items-center justify-center text-muted-foreground overflow-hidden">
                {images[0]?.image_url ? (
                  <img
                    src={images[0]?.image_url}
                    alt="Venue Preview"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Building2 size={36} className="opacity-40 text-primary" />
                    <span className="text-xs font-medium">No Image Uploaded</span>
                  </div>
                )}
                {selectedCategory && (
                  <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                    {selectedCategory.name}
                  </span>
                )}
              </div>

              {/* Preview Details */}
              <div className="p-4 space-y-3">
                <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1">
                  {formData.name || "Grand Palace Ballroom"}
                </h3>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin size={14} className="text-primary/70 shrink-0" />
                  <span className="line-clamp-1">
                    {selectedCity
                      ? `${selectedCity.name}, ${districts.find((d) => String(d.id) === String(formData.district))?.name ?? ""}`
                      : "City Center, Kochi"}
                    {formData.address ? `, ${formData.address}` : ""}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-border/30 pt-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users size={14} className="text-primary/70" />
                    <span>{formData.capacity ? `${formData.capacity} Guests` : "— Guests"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock size={14} className="text-primary/70" />
                    <span>{selectedBookingType ? selectedBookingType.label : "— Booking"}</span>
                  </div>
                </div>

                {amenities.length > 0 && (
                  <div className="border-t border-border/30 pt-3">
                    <div className="flex flex-wrap gap-1">
                      {amenities.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-2 py-0.5 rounded-full">
                          {item}
                        </span>
                      ))}
                      {amenities.length > 3 && (
                        <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                          +{amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Amenities Section */}
          <motion.section
            variants={cardVariants}
            className="rounded-2xl border border-border/60 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-4">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">
                  Amenities
                </h2>
                <p className="text-xs text-muted-foreground">
                  List services like parking, catering, Wi-Fi, etc.
                </p>
              </div>
            </div>

            {!fieldsDisabled && (
            <div className="flex gap-2">
              <input
                type="text"
                className="input flex-1"
                placeholder="e.g., Free Wi-Fi"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
              />
              <button
                type="button"
                onClick={addAmenity}
                className="btn btn-primary px-3 cursor-pointer"
                title="Add Amenity"
              >
                <Plus size={18} />
              </button>
            </div>
            )}

            <div className="flex flex-wrap gap-1.5 mt-4 max-h-[160px] overflow-y-auto pr-1">
              <AnimatePresence>
                {amenities.map((item, index) => (
                  <motion.div
                    key={item + index}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                    layout
                    className="flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {item}
                    {!fieldsDisabled && (
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="text-primary/70 hover:text-primary hover:bg-primary/10 rounded-full p-0.5 transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {amenities.length === 0 && (
              <span className="text-xs text-muted-foreground/60 italic block mt-1">
                No amenities added yet.
              </span>
            )}
          </motion.section>

          {/* Venue Images Section */}
          <motion.section
            variants={cardVariants}
            className="rounded-2xl border border-border/60 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-4">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <ImageIcon size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">
                  Venue Images
                </h2>
                <p className="text-xs text-muted-foreground">
                  Upload multiple photos of the interior/exterior.
                </p>
              </div>
            </div>

            {/* Drag & Drop Area */}
            {!fieldsDisabled && (
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border hover:border-primary/60 hover:bg-secondary/40"
              }`}
            >
              <Upload size={32} className={`${isDragging ? "text-primary animate-bounce" : "text-muted-foreground/80"}`} />
              <span className="mt-3 text-sm font-semibold text-foreground">
                Drag & Drop Images
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                or click to browse local files
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={handleImages}
              />
            </label>
            )}

            {/* File List / Previews */}
            {images.length > 0 && (
              <div className="mt-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Uploaded ({images.length})
                  </span>

                  {!fieldsDisabled && (
                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="text-[11px] font-bold text-accent hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <AnimatePresence>
                    {images.map((image, idx) => (
                      <motion.div
                        key={image.public_id || idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative aspect-square rounded-xl overflow-hidden border border-border group"
                      >
                        <img
                          src={image.image_url}
                          alt={`Upload ${idx}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />

                        {image.is_cover && (
                          <span className="absolute top-1 left-1 bg-primary text-white text-[10px] px-2 py-1 rounded">
                            Cover
                          </span>
                        )}

                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity text-white rounded-xl cursor-pointer ${
                      fieldsDisabled ? "hidden" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {images.length === 0 && (
              <p className="mt-3 text-xs text-muted-foreground/60 italic">
                No images selected yet.
              </p>
            )}
          {uploading && (
            <div className="mt-3 text-sm text-primary font-medium">
              Uploading images...
            </div>
          )}
          </motion.section>
        </div>
      </motion.div>
      )}

      {/* Footer Form Submission buttons */}
      {activeTab === "details" && (!isEditMode || isEditing) && (
      <div className="flex flex-col items-end gap-3 mt-8 border-t border-border/40 pt-6">
        {submitError && (
          <p className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </p>
        )}

        <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="btn btn-outline"
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={submitting || loadingOptions || uploading}
        >
          {submitting
            ? isEditMode
              ? "Saving..."
              : "Creating Venue..."
            : isEditMode
              ? "Save changes"
              : "Create Venue"}
        </button>
        </div>
      </div>
      )}
    </div>
  )
}
