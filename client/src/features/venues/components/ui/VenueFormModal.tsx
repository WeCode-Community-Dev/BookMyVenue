import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Trash2, MapPin, Upload, Loader2, Pencil } from 'lucide-react';
import ImageEditorModal from './ImageEditorModal';
import { ownerVenuesApi } from '../../services/owner-venues.api';
import type { Venue } from '../../types/venues.types';
import type { Category } from '@/features/categories/types';
import { toast } from 'sonner';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { venueSchema, type FormValues } from '../../schemas/venue.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { publicVenuesApi } from '@/features/public/services/public-venues.api';

type Props = {
  venue: Venue | null; // null = create mode
  onClose: () => void;
  onSuccess: () => void;
};

const VenueFormModal = ({ venue, onClose, onSuccess }: Props) => {
  const isEditMode = !!venue;
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [amenities, setAmenities] = useState<string[]>(venue?.amenities || []);
  const [amenityInput, setAmenityInput] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(venue?.images || []);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false)
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [editingImage, setEditingImage] = useState<{
    url: string;
    index: number;
    isExisting: boolean;
  } | null>(null);

  const [cropQueue, setCropQueue] = useState<{ file: File; objectUrl: string }[]>([]);

  const defaultLng = venue?.location?.coordinates?.[0] || 76.2711;
  const defaultLat = venue?.location?.coordinates?.[1] || 10.8505;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(venueSchema),

    defaultValues: {
      name: venue?.name || '',
      description: venue?.description || '',
      categoryId:
        venue?.categoryId && typeof venue.categoryId === 'object'
          ? venue.categoryId._id
          : typeof venue?.categoryId === 'string'
            ? venue.categoryId
            : '',
      street: venue?.address?.street || '',
      city: venue?.address?.city || '',
      district: venue?.address?.district || '',
      state: venue?.address?.state || '',
      pincode: venue?.address?.pincode || '',
      longitude: defaultLng,
      latitude: defaultLat,
      capacity: venue?.capacity || 1,
    },
  });

  const longitude = watch('longitude');
  const latitude = watch('latitude');

  // Load categories for dropdown
  useEffect(() => {
    setIsLoadingCategories(true)
    publicVenuesApi
      .getCategoreis()
      .then((res) => {
        setCategories(res?.data?.categories);
      })
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setIsLoadingCategories(false))
  }, [venue, setValue]);


  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Fix Leaflet default icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    const map = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setValue('latitude', parseFloat(pos.lat.toFixed(6)));
      setValue('longitude', parseFloat(pos.lng.toFixed(6)));
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      setValue('latitude', parseFloat(e.latlng.lat.toFixed(6)));
      setValue('longitude', parseFloat(e.latlng.lng.toFixed(6)));
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Resize fix for modal
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Sync marker when coords change via input
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current.setView([latitude, longitude], mapInstanceRef.current.getZoom());
    }
  }, [latitude, longitude]);

  // Image file handling
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image. Only JPG, PNG, and WEBP are allowed.`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newQueueItems = validFiles.map((file) => ({
        file,
        objectUrl: URL.createObjectURL(file),
      }));
      setCropQueue((prev) => [...prev, ...newQueueItems]);
    }

    // Clear the input so the same files can be selected again if needed
    e.target.value = '';
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveCrop = (croppedFiles: File[]) => {
    if (editingImage) {
      const croppedFile = croppedFiles[0];
      if (editingImage.isExisting) {
        setExistingImages((prev) => prev.filter((_, i) => i !== editingImage.index));
        setImageFiles((prev) => [...prev, croppedFile]);
        setImagePreviews((prev) => [...prev, URL.createObjectURL(croppedFile)]);
      } else {
        setImageFiles((prev) => {
          const newFiles = [...prev];
          newFiles[editingImage.index] = croppedFile;
          return newFiles;
        });
        setImagePreviews((prev) => {
          const newPreviews = [...prev];
          URL.revokeObjectURL(newPreviews[editingImage.index]);
          newPreviews[editingImage.index] = URL.createObjectURL(croppedFile);
          return newPreviews;
        });
      }
      setEditingImage(null);
    } else if (cropQueue.length > 0) {
      setImageFiles((prev) => [...prev, ...croppedFiles]);
      const newPreviews = croppedFiles.map((f) => URL.createObjectURL(f));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      cropQueue.forEach((item) => URL.revokeObjectURL(item.objectUrl));
      setCropQueue([]);
    }
  };

  const handleCancelCrop = () => {
    if (editingImage) {
      setEditingImage(null);
    } else if (cropQueue.length > 0) {
      cropQueue.forEach((item) => URL.revokeObjectURL(item.objectUrl));
      setCropQueue([]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Amenities
  const addAmenity = () => {
    const trimmed = amenityInput.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setAmenities((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit
  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('categoryId', data.categoryId);

      // Address as JSON
      formData.append(
        'address',
        JSON.stringify({
          street: data.street,
          city: data.city,
          district: data.district,
          state: data.state,
          pincode: data.pincode,
        })
      );

      // Location as JSON
      formData.append(
        'location',
        JSON.stringify({
          type: 'Point',
          coordinates: [data.longitude, data.latitude],
        })
      );

      formData.append('capacity', String(data.capacity));

      // Amenities
      formData.append('amenities', JSON.stringify(amenities));

      // Images
      imageFiles.forEach((file) => formData.append('images', file));

      if (isEditMode) {
        formData.append('existingImages', JSON.stringify(existingImages));
        await ownerVenuesApi.update(venue._id, formData);
        toast.success('Venue updated successfully');
      } else {
        await ownerVenuesApi.create(formData);
        toast.success('Venue created successfully');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 sm:p-6">
      <div className="relative w-full max-w-3xl rounded-3xl border border-border bg-card shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">
            {isEditMode ? 'Edit Venue' : 'Add New Venue'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted hover:text-foreground hover:bg-background transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit as any)}
          className="p-6 space-y-6 max-h-[75vh] overflow-y-auto"
        >
          {/* Basic Info */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
              Basic Information
            </legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">
                  Venue Name *
                </label>
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Min 2 characters' },
                  })}
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Enter venue name"
                />
                {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Category *</label>

                {/* If loading, show a disabled select with a spinner icon */}
                {isLoadingCategories ? (
                  <div className="flex items-center w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-muted opacity-60 cursor-not-allowed">
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Loading categories...
                  </div>
                ) : (
                  /* If done loading, show the real select */
                  <>
                    <select
                      {...register('categoryId', { required: 'Category is required' })}
                      className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground outline-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/10"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="text-xs text-error mt-1">{errors.categoryId.message}</p>
                    )}
                  </>
                )}
              </div>

            </div>

            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Description *</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={3}
                className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground outline-none resize-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Describe your venue..."
              />
              {errors.description && (
                <p className="text-xs text-error mt-1">{errors.description.message}</p>
              )}
            </div>
          </fieldset>

          {/* Address */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
              Address
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Street *</label>
                <input
                  {...register('street', { required: 'Street is required' })}
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Street address"
                />
                {errors.street && (
                  <p className="text-xs text-error mt-1">{errors.street.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">City *</label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="City"
                />
                {errors.city && <p className="text-xs text-error mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">District *</label>
                <input
                  {...register('district', { required: 'District is required' })}
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="District"
                />
                {errors.district && (
                  <p className="text-xs text-error mt-1">{errors.district.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">State *</label>
                <input
                  {...register('state', { required: 'State is required' })}
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="State"
                />
                {errors.state && <p className="text-xs text-error mt-1">{errors.state.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Pincode *</label>
                <input
                  {...register('pincode', { required: 'Pincode is required' })}
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Pincode"
                />
                {errors.pincode && (
                  <p className="text-xs text-error mt-1">{errors.pincode.message}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Location Map */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} />
                Location on Map
              </span>
            </legend>

            <div
              ref={mapRef}
              className="h-64 w-full rounded-xl border border-border overflow-hidden z-0"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Longitude</label>
                <input
                  type="number"
                  step="any"
                  {...register('longitude', { required: true, valueAsNumber: true })}
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Latitude</label>
                <input
                  type="number"
                  step="any"
                  {...register('latitude', { required: true, valueAsNumber: true })}
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
            <p className="text-[10px] text-muted">
              Click on the map or drag the marker to set location
            </p>
          </fieldset>

          {/* Capacity */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
              Capacity
            </legend>
            <div className="grid gap-4 sm:grid-cols-1">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5">Capacity *</label>
                <input
                  type="number"
                  {...register('capacity', {
                    required: 'Required',
                    valueAsNumber: true,
                    min: { value: 1, message: 'Min 1' },
                  })}
                  className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  placeholder="Max capacity"
                />
                {errors.capacity && (
                  <p className="text-xs text-error mt-1">{errors.capacity.message}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Amenities */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
              Amenities
            </legend>
            <div className="flex gap-2">
              <input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
                className="flex-1 rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="e.g. Parking, WiFi, AC..."
              />
              <button
                type="button"
                onClick={addAmenity}
                className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-all cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {amenities.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-background border border-border px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeAmenity(i)}
                      className="text-muted hover:text-error transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </fieldset>

          {/* Images */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
              Images
            </legend>

            {/* Existing images (edit mode) */}
            {existingImages.length > 0 && (
              <div className="grid gap-3 grid-cols-3 sm:grid-cols-4">
                {existingImages.map((url, i) => (
                  <div
                    key={url}
                    className="relative group rounded-xl overflow-hidden border border-border"
                  >
                    <img src={url} alt={`Venue ${i + 1}`} className="h-24 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditingImage({ url, index: i, isExisting: true })}
                      className="absolute top-1 right-8 rounded-full bg-primary/90 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute top-1 right-1 rounded-full bg-error/90 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New image previews */}
            {imagePreviews.length > 0 && (
              <div className="grid gap-3 grid-cols-3 sm:grid-cols-4">
                {imagePreviews.map((url, i) => (
                  <div
                    key={url}
                    className="relative group rounded-xl overflow-hidden border border-primary/30"
                  >
                    <img src={url} alt={`New ${i + 1}`} className="h-24 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditingImage({ url, index: i, isExisting: false })}
                      className="absolute top-1 right-8 rounded-full bg-primary/90 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 rounded-full bg-error/90 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                    <span className="absolute bottom-1 left-1 rounded bg-primary/80 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      NEW
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background py-6 text-sm text-muted hover:border-primary/50 hover:text-primary transition-all cursor-pointer">
              <Upload size={18} />
              <span className="font-medium">Click to upload images</span>
              <input
                type="file"
                multiple
                accept="image/jpeg, image/png, image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </fieldset>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-surface transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit as any)}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-accent transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {isEditMode ? 'Update Venue' : 'Create Venue'}
          </button>
        </div>
      </div>
      <ImageEditorModal
        isOpen={!!editingImage || cropQueue.length > 0}
        onClose={handleCancelCrop}
        images={editingImage ? [editingImage.url] : cropQueue.map((item) => item.objectUrl)}
        onSave={handleSaveCrop}
      />
    </div>
  );
};

export default VenueFormModal;
