import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createVenueFormSchema, type CreateVenueFormValues } from "@/validator/venue-schema";
import { useCreateVenue, useMyVenues, useUpdateVenue, MY_VENUES_QUERY_KEY } from "@/hooks/use-venue";
import { uploadImages } from "@/lib/cloudinary";
import { VENUE_TYPES, VENUE_TYPE_LABELS } from "@/types/venue.types";

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const fromMinutes = (total: number) => {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

interface ImagePreview {
  file: File;
  url: string;
}

const CreateVenueForm = () => {
  const queryClient = useQueryClient();
  const createVenue = useCreateVenue();
  const updateVenue = useUpdateVenue();
  const { data: myVenues } = useMyVenues();

  // the owner edits their existing venue if they already have one
  const existingVenue = myVenues?.[0];
  const isEditMode = Boolean(existingVenue);

  const [images, setImages] = useState<ImagePreview[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateVenueFormValues>({
    resolver: zodResolver(createVenueFormSchema),
    defaultValues: {
      name: "",
      description: "",
      venueType: "BANQUET_HALL",
      address: "",
      city: "",
      capacity: "",
      pricePerHour: "",
      openingTime: "09:00",
      closingTime: "23:00",
      amenities: "",
    },
  });

  // populate the form once the owner's venue is loaded
  useEffect(() => {
    if (existingVenue) {
      reset({
        name: existingVenue.name,
        description: existingVenue.description ?? "",
        venueType: existingVenue.venueType,
        address: existingVenue.address ?? "",
        city: existingVenue.city ?? "",
        capacity: existingVenue.capacity?.toString() ?? "",
        pricePerHour: existingVenue.pricePerHour.toString(),
        openingTime: fromMinutes(existingVenue.openingTime),
        closingTime: fromMinutes(existingVenue.closingTime),
        amenities: existingVenue.amenities.join(", "),
      });
      setExistingImages(existingVenue.images ?? []);
    }
  }, [existingVenue, reset]);

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const mapped = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...mapped]);
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((item) => item !== url));
  };

  const onSubmit = async (values: CreateVenueFormValues) => {
    let uploadedUrls: string[] = [];
    if (images.length > 0) {
      try {
        setIsUploading(true);
        uploadedUrls = await uploadImages(images.map((image) => image.file));
      } catch {
        toast.error("Image upload failed. Please try again.");
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const allImages = [...existingImages, ...uploadedUrls];

    const payload = {
      name: values.name,
      description: values.description || undefined,
      venueType: values.venueType,
      address: values.address || undefined,
      city: values.city || undefined,
      capacity: values.capacity ? Number(values.capacity) : undefined,
      pricePerHour: Number(values.pricePerHour),
      openingTime: toMinutes(values.openingTime),
      closingTime: toMinutes(values.closingTime),
      amenities: values.amenities
        ? values.amenities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : undefined,
    };

    const onSettled = () => queryClient.invalidateQueries({ queryKey: MY_VENUES_QUERY_KEY });

    if (isEditMode && existingVenue) {
      updateVenue.mutate(
        { venueId: existingVenue._id, payload: { ...payload, images: allImages } },
        {
          onSuccess: () => {
            toast.success("Venue updated successfully");
            setImages([]);
            onSettled();
          },
          onError: (error) => toast.error(errorMessage(error, "Could not update venue.")),
        },
      );
    } else {
      createVenue.mutate(
        { ...payload, images: allImages.length > 0 ? allImages : undefined },
        {
          onSuccess: () => {
            toast.success("Venue created successfully");
            setImages([]);
            onSettled();
          },
          onError: (error) => toast.error(errorMessage(error, "Could not create venue.")),
        },
      );
    }
  };

  const errorMessage = (error: unknown, fallback: string) =>
    isAxiosError(error) ? (error.response?.data?.message ?? fallback) : fallback;

  const isSubmitting = isUploading || createVenue.isPending || updateVenue.isPending;
  const submitLabel = isUploading
    ? "Uploading images..."
    : isSubmitting
      ? "Saving..."
      : isEditMode
        ? "Update venue"
        : "Create venue";

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{isEditMode ? "Your venue" : "Create a venue"}</h1>
        <p className="text-sm text-muted-foreground">
          {isEditMode
            ? "Update your venue details below."
            : "List your venue for customers to book."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-5">
          <Field className="gap-1.5">
            <FieldLabel htmlFor="name">Name*</FieldLabel>
            <Input id="name" placeholder="Grand Banquet Hall" {...register("name")} />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field className="gap-1.5">
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              placeholder="Tell customers about your venue"
              {...register("description")}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field className="gap-1.5">
              <FieldLabel htmlFor="venueType">Venue type*</FieldLabel>
              <Controller
                control={control}
                name="venueType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="venueType" className="w-full">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VENUE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {VENUE_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.venueType && <FieldError>{errors.venueType.message}</FieldError>}
            </Field>

            <Field className="gap-1.5">
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input id="city" placeholder="Mumbai" {...register("city")} />
            </Field>
          </div>

          <Field className="gap-1.5">
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <Input id="address" placeholder="123 Marina Road" {...register("address")} />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field className="gap-1.5">
              <FieldLabel htmlFor="capacity">Capacity</FieldLabel>
              <Input id="capacity" type="number" min={1} placeholder="300" {...register("capacity")} />
              {errors.capacity && <FieldError>{errors.capacity.message}</FieldError>}
            </Field>

            <Field className="gap-1.5">
              <FieldLabel htmlFor="pricePerHour">Price per hour (₹)*</FieldLabel>
              <Input
                id="pricePerHour"
                type="number"
                min={0}
                placeholder="500"
                {...register("pricePerHour")}
              />
              {errors.pricePerHour && <FieldError>{errors.pricePerHour.message}</FieldError>}
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field className="gap-1.5">
              <FieldLabel htmlFor="openingTime">Opening time*</FieldLabel>
              <Input id="openingTime" type="time" {...register("openingTime")} />
              {errors.openingTime && <FieldError>{errors.openingTime.message}</FieldError>}
            </Field>

            <Field className="gap-1.5">
              <FieldLabel htmlFor="closingTime">Closing time*</FieldLabel>
              <Input id="closingTime" type="time" {...register("closingTime")} />
              {errors.closingTime && <FieldError>{errors.closingTime.message}</FieldError>}
            </Field>
          </div>

          <Field className="gap-1.5">
            <FieldLabel htmlFor="amenities">Amenities</FieldLabel>
            <Input
              id="amenities"
              placeholder="Parking, AC, Catering (comma separated)"
              {...register("amenities")}
            />
          </Field>

          <Field className="gap-1.5">
            <FieldLabel htmlFor="images">Images</FieldLabel>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="cursor-pointer"
            />
            {(existingImages.length > 0 || images.length > 0) && (
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {existingImages.map((url) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-md border">
                    <img src={url} alt="venue" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-background opacity-0 transition group-hover:opacity-100">
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                {images.map((image, index) => (
                  <div
                    key={image.url}
                    className="group relative aspect-square overflow-hidden rounded-md border">
                    <img src={image.url} alt="venue" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-background opacity-0 transition group-hover:opacity-100">
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="rounded-lg h-10 cursor-pointer self-start">
            {submitLabel}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default CreateVenueForm;
