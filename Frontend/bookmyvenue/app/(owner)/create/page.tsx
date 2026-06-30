'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  IconArrowLeft,
  IconBuilding,
  IconCash,
  IconUsers,
  IconToolsKitchen2,
  IconParking,
  IconPlayBasketball,
  IconAirConditioning,
  IconWifi,
  IconVolume,
  IconBattery,
  IconMovie,
  IconPlus,
  IconTrash,
  IconUpload,
  IconCheck,
  IconHelpCircle,
  IconLoader
} from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { getAllCategories, getAllAmenities, discardAllLocationDetails } from '@/features/venueCreateFeatureSlice'
import { Spinner } from '@/components/ui/spinner'
import DynamicTablerIcon from '@/components/DynamicTabularIcons'
import { LocationFinder } from '@/components/locationFinder'
import LocationSuggest from '@/components/LocationSuggest'
import axios from 'axios'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
// --- Types & Constants ---

interface AmenityOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface CategoryOption {
  id: string;
  name: string;
}


// Pre-populated quick mock images for testing
const MOCK_GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=600",
  "https://www.alsajconventioncenter.com/wp-content/uploads/2023/07/Arena.png",
];

function CreateVenuePage() {

  const { amenities, categories, initialLoading,locationStreetAddress, cityName, country, districtName, stateName } = useAppSelector((state) => state.veneueCreation)
  const dispatch = useAppDispatch()
  const { getToken } = useAuth()
  // Form Field States
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [gLocation, setGlocation] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyRent, setHourlyRent] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [galleryfiles, setGalleryfiles] = useState<File[]>([])
  const [coverfile, setcoverFile] = useState<File | null>(null);
  // Selection States
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Media Upload Simulation States
  const [coverImage, setCoverImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Page Lifecycle States
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Cancellation Policy States
  const [allowCancellation, setAllowCancellation] = useState(false);
  const [cancellationHours, setCancellationHours] = useState('24');
  const [refundPercentage, setRefundPercentage] = useState('100');


  // Handle selections
  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Cover image file helper
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setcoverFile(file)
      const simulatedUrl = URL.createObjectURL(file);
      setCoverImage(simulatedUrl);
    }
  };
  const triggerGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGalleryfiles(prev => [...prev, file]);
      const simulatedUrl = URL.createObjectURL(file);
      setGalleryImages(prev => [...prev, simulatedUrl]);;
    }
  };

  const setQuickCover = (url: string) => {
    setCoverImage(url);
  }

  const removeGalleryPhoto = (index: number) => {
    setGalleryImages(prev => prev.filter((_, idx) => idx !== index));
    setGalleryfiles(prev => prev.filter((_, idx) => idx !== index));
  };

  // Form submission simulation


  const getTheCategories = async (requestUrl: string) => {
    dispatch(getAllCategories({
      requestUrl: requestUrl,
    }))
  }
  const getTheAmenities = async (requestUrl: string) => {
    dispatch(getAllAmenities
      (
        {
          requestUrl: requestUrl,
        }
      )
    )
  }


  useEffect(() => {
    getTheCategories(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/categories`)
    getTheAmenities(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/amenities`)
  }, [])


  const HandleVenueSubmission = async (e) => {
    e.preventDefault()
    console.log(name, locationStreetAddress, cityName,districtName, country,stateName)
    console.log(gLocation, description, hourlyRent, maxCapacity)
    console.log(selectedAmenities, selectedCategories)
    console.log(coverImage, galleryImages)
    console.log(submitStatus , allowCancellation , cancellationHours, refundPercentage)

    const formData = new FormData()
    formData.append('payload', JSON.stringify({
      name: name,
      max_capacity: maxCapacity,
      city: cityName,
      district: districtName,
      state: stateName,
      country: country,
      location_url: gLocation,
      description: description,
      cancellation: allowCancellation,
      cancellation_percentage: refundPercentage,
      street_address: locationStreetAddress,
      minimum_slot_duration: duration,
      cancellation_time_limit: cancellationHours,
      categories:selectedCategories,
      amenities: selectedAmenities,
      hourly_rent: hourlyRent,
    }))
    
    if (coverfile) {
      formData.append("cover_image", coverfile)
    }
    for (const file of galleryfiles){ 
      formData.append("gallery", file)  // an element where array of data is to be uploaded is given by adding the data with giving the elemtn name repeatly
    }

    const jwtToken = await getToken() 
    console.log("trying to create venue...")
    axios
      .post(`${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/owner/venue`, formData, {
        headers: {
          // Headers are nested under the 'headers' key
          authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((res) => {
        console.log(res)
        if (res.data.status_code == 200) {
          toast.success("completed the owner onboarding...")
        
        }
        if (res.data.status_code == 201) {
          toast.success("you have onboarded already!")
      
        }
      })
      .catch((err) => {
        console.log(err)
        if (err.response) {
          toast.info(err.response.message)
        }
      })
      .finally(() => {
      })


  }

  if (initialLoading) {
    return (
      <div>
        <div className='w-full h-96 flex items-center justify-center'>
          <div className='bg-red-500' />
          <div className='flex flex-col items-center justify-center gap-2'>
            <h3 className='font-bold text-3xl font-heading'>Preparing the venue form</h3>
            <p className='font-normal text-muted-foreground'>Adding the meta data like categories and amenities</p>
            <Spinner className='size-6' />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 md:max-w-7xl mx-auto my-6 flex flex-col gap-6 font-sans">

      {/* Back button and Header banner */}
      <div className="flex flex-col gap-2 border-b border-border pb-6">
        <Link href="/dashboard" className="text-xs text-primary font-bold flex items-center gap-1 hover:underline w-fit">
          <IconArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground flex items-center gap-2">
              List Your Venue
            </h1>
            <p className="text-muted-foreground">
              Provide the structural parameters, pricing details, amenities list, and visual media to create your listing.
            </p>
          </div>
          <Badge variant="outline" className="border-primary text-primary font-bold">
            Listing Creator Mode
          </Badge>
        </div>
      </div>


      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Input form details (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Basic Specifications Card */}
          <Card className="border-border dark:bg-secondary/30 overflow-y-scroll no-scrollbar">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Basic Information</CardTitle>
              <CardDescription>Primary identification details and metrics</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="venueName" className="font-semibold text-xs text-foreground uppercase tracking-wide">
                    Venue Name *
                  </Label>
                  <Input
                    id="venueName"
                    placeholder="e.g. Al Saj Convention Arena"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                <LocationSuggest fieldName='Location/Street Address' type='streetAddress' dummyPlaceholder='vetturoad, kazhakootam' />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="hourlyRent" className="font-semibold text-xs text-foreground uppercase tracking-wide flex items-center gap-1">
                    <IconCash size={14} className="text-primary" /> Hourly Rent ($USD) *
                  </Label>
                  <Input
                    id="hourlyRent"
                    type="number"
                    placeholder="e.g. 150"
                    value={hourlyRent}
                    onChange={e => setHourlyRent(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="maxCapacity" className="font-semibold text-xs text-foreground uppercase tracking-wide flex items-center gap-1">
                    <IconUsers size={14} className="text-primary" /> Max Seating Capacity *
                  </Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    placeholder="e.g. 500"
                    value={maxCapacity}
                    onChange={e => setMaxCapacity(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geographical Hierarchy Card */}
          <Card className="border-border dark:bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Geographical Details</CardTitle>
              <CardDescription>Specify the region parameters for location routing</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <LocationSuggest fieldName='City Name' type='city' dummyPlaceholder='trivandrum' />


              <LocationSuggest fieldName='District Name' type='district' dummyPlaceholder='thiruvananthapuram' />


              <LocationSuggest fieldName='State Name' type='state' dummyPlaceholder='kerala' />


              <LocationSuggest fieldName='Country' type='country' dummyPlaceholder='India' />

              <div className="flex flex-col gap-1.5 w-full">
                <Label htmlFor="districtName" className="font-semibold text-xs text-foreground uppercase tracking-wide">
                  Google Map Location
                </Label>
                <Input
                  id="districtName"
                  placeholder="Please provide maps share link"
                  value={gLocation}
                  onChange={e => setGlocation(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Description Textarea Card */}
          <Card className="border-border dark:bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Venue Description</CardTitle>
              <CardDescription>Tell prospective clients about the unique values of your space</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description" className="font-semibold text-xs text-foreground uppercase tracking-wide">
                  Detailed Summary
                </Label>
                <Textarea
                  id="description"
                  placeholder="Al Saj Convention Group is an international provider of venues for all kinds of events in your life. Let your valuable moments of life be made precious with us..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="min-h-32 text-left align-top placeholder:text-muted-foreground/60"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Policy Card */}
          <Card className="border-border dark:bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Cancellation Policy</CardTitle>
              <CardDescription>Configure terms and parameters for booking cancellations</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-semibold text-xs text-foreground uppercase tracking-wide">
                  Are you willing to allow cancellation for this venue?
                </Label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setAllowCancellation(true)}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${allowCancellation ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-border bg-background dark:bg-neutral-900 text-muted-foreground hover:text-foreground'}`}
                  >
                    <span className="text-sm select-none">Yes, allow cancellation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllowCancellation(false)}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${!allowCancellation ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-border bg-background dark:bg-neutral-900 text-muted-foreground hover:text-foreground'}`}
                  >
                    <span className="text-sm select-none">No cancellation allowed</span>
                  </button>
                </div>
              </div>

              {allowCancellation && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50 animate-fade-in">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="cancelHours" className="font-semibold text-xs text-foreground uppercase tracking-wide">
                      Cancellation Window (Hours) *
                    </Label>
                    <div className="relative">
                      <Input
                        id="cancelHours"
                        type="number"
                        min="1"
                        placeholder="e.g. 24"
                        value={cancellationHours}
                        onChange={e => setCancellationHours(e.target.value)}
                        required={allowCancellation}
                      />
                      <span className="absolute right-3 top-1 text-xs text-muted-foreground select-none pointer-events-none mt-1">
                        hours before
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Minimum lead time required before the event starts to cancel.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="refundPercent" className="font-semibold text-xs text-foreground uppercase tracking-wide">
                      Required Refund Percentage (%) *
                    </Label>
                    <div className="relative">
                      <Input
                        id="refundPercent"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="e.g. 80"
                        value={refundPercentage}
                        onChange={e => setRefundPercentage(e.target.value)}
                        required={allowCancellation}
                      />
                      <span className="absolute right-3 top-1 text-xs text-muted-foreground select-none pointer-events-none mt-1">
                        % refund
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Percentage of rent amount that will used as fine.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interactive Amenities and Categories Selection Card */}
          <Card className="border-border dark:bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Amenities & Event Categories</CardTitle>
              <CardDescription>Select all features and classifications matching your listing</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">

              {/* Amenities Toggle grid */}
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-xs uppercase tracking-wide text-foreground flex items-center gap-1.5">
                  What This Place Offers
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {amenities.map((amen) => {
                    const isSelected = selectedAmenities.includes(amen.id);
                    return (
                      <div
                        key={amen.id}
                        onClick={() => toggleAmenity(amen.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all duration-300 ${isSelected ? 'border-primary bg-primary/5 text-primary scale-95 shadow-md shadow-primary/5' : 'border-border bg-background dark:bg-neutral-900 text-muted-foreground hover:text-foreground hover:border-muted-foreground/45'}`}
                      >
                        <div className={`p-2 rounded-full transition-colors ${isSelected ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                          <DynamicTablerIcon name={amen.icon_name.trimEnd()} />
                        </div>
                        <span className="text-xs font-semibold select-none">{amen.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Categories badges selection */}
              <div className="flex flex-col gap-3 border-t border-border pt-4">
                <h4 className="font-bold text-xs uppercase tracking-wide text-foreground">
                  Classification Category Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <span
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border select-none transition-all duration-300 ${isSelected ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'}`}
                      >
                        {cat.name}
                      </span>
                    );
                  })}
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* RIGHT COLUMN: Media Upload & Submission Actions (1 Col) */}
        <div className="flex flex-col gap-6">

          {/* Cover Image Upload Card */}
          <Card className="border-border dark:bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Cover Image</CardTitle>
              <CardDescription>Primary banner photograph of the location</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {coverImage ? (
                <div className="relative aspect-video w-full h-44 rounded-xl overflow-hidden border border-border group">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setCoverImage('')}
                      className="bg-red-600 text-white font-semibold flex items-center gap-1.5 py-1 px-3"
                    >
                      <IconTrash size={16} /> Remove Cover
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-xl aspect-video w-full h-44 flex flex-col items-center justify-center text-center gap-2 bg-secondary/15 dark:bg-neutral-900/35 p-4 hover:border-primary/45 transition-colors">
                  <IconUpload size={32} className="text-muted-foreground" />
                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="font-semibold text-foreground">Click to simulated upload</span>
                    <span className="text-muted-foreground">Supports JPEG, PNG up to 10MB</span>
                  </div>

                  <input
                    type="file"
                    id="coverImageUpload"
                    accept="image/*"
                    onChange={handleCoverSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => document.getElementById('coverImageUpload')?.click()}
                    className="mt-1.5 bg-primary text-primary-foreground font-semibold"
                  >
                    Choose File
                  </Button>
                </div>
              )}

              {/* Quick mock selector to bypass file uploading */}
              <div className="flex flex-col gap-2 border-t border-border/80 pt-3">
                <span className="text-[10px] uppercase font-bold tracking-wide text-muted-foreground flex items-center gap-1">
                  <IconHelpCircle size={12} /> Or select quick mockup cover
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {MOCK_GALLERY_IMAGES.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => setQuickCover(url)}
                      className={`aspect-video rounded-lg overflow-hidden border cursor-pointer hover:scale-105 transition-transform ${coverImage === url ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
                    >
                      <img src={url} alt="Mock thumb" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Gallery Upload Card */}
          <Card className="border-border dark:bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Gallery Photos</CardTitle>
              <CardDescription>Attach as many visual representations as you want</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">

              {/* Gallery photo items grid */}
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border group"
                  >
                    <img
                      src={url}
                      alt={`Gallery ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryPhoto(index)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 rounded-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IconTrash size={12} />
                    </button>
                  </div>
                ))}

                {/* Add (+) photo interactive slot */}
                <div className="border-2 border-dashed border-border rounded-xl aspect-video w-full h-44 flex flex-col items-center justify-center text-center gap-2 bg-secondary/15 dark:bg-neutral-900/35 p-4 hover:border-primary/45 transition-colors">
                  <IconUpload size={32} className="text-muted-foreground" />
                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="font-semibold text-foreground">Click to simulated upload</span>
                    <span className="text-muted-foreground">Supports JPEG, PNG up to 10MB</span>
                  </div>

                  <input
                    type="file"
                    id="coverImageUpload"
                    accept="image/*"
                    onChange={triggerGalleryAdd}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => document.getElementById('coverImageUpload')?.click()}
                    className="mt-1.5 bg-primary text-primary-foreground font-semibold"
                  >
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="text-[10px] text-muted-foreground leading-relaxed italic bg-secondary/50 dark:bg-neutral-900/40 p-2 rounded-lg">
                Click the <strong>Add Photo</strong> card to dynamically simulate uploading custom gallery images. You can repeat this process to attach as many photos as desired.
              </div>

              <div className="flex flex-col gap-1.5">
                  <Label htmlFor="venueName" className="font-semibold text-xs text-foreground uppercase tracking-wide">
                    Minimum Slot Duration *
                  </Label>
                  <Input
                    id="duration"
                    type='number'
                    placeholder="e.g. 3"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                  />
                </div>

            </CardContent>
          </Card>

          {/* Publish & Submission triggers */}
          <Card className="border-border dark:bg-secondary/30">
            <CardContent className="p-4 flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/95 h-11 text-md shadow-lg shadow-primary/10 cursor-pointer"
                onClick={(e) => {
                  HandleVenueSubmission(e)
                }}
              >
                List Venue for Review
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full border-border font-semibold h-10"
                onClick={() => {
                  dispatch(
                    discardAllLocationDetails()  // clears out all the selected items
                  )
                }}
              >
                Discard and Cancel
              </Button>

            </CardContent>
          </Card>

        </div>

      </form>


    </div>
  );
}

export default CreateVenuePage
