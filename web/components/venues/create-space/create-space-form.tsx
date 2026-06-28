"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Camera,
  Check,
  Eye,
  Gavel,
  Info,
  Loader2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { IconInput } from "@/components/auth/icon-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { VenueImageGallery } from "@/components/venues/create/venue-image-gallery";
import { VenueImageUploadZone } from "@/components/venues/create/venue-image-upload-zone";
import type { VenueImage } from "@/lib/data/list-venue";
import {
  CapacityType,
  capacityTypeLabels,
} from "@/lib/data/venues";
import {
  createImageFromFile,
  orderImageIdsWithCoverFirst,
} from "@/lib/utils/venue-image";
import { uploadFile } from "@/services/r2Services";
import {
  createImages,
  createSpace,
  getCapacityTypes,
  getSpaceCategories,
  type SpaceCategoryResponse,
} from "@/services/venueServices";

import { CreateSpaceFormActions } from "./create-space-form-actions";
import { CreateSpacePreviewPanel } from "./create-space-preview-panel";
import { FormSectionCard } from "./form-section-card";
import { SpaceAmenitySection } from "./space-amenity-section";
import { SpaceCategorySelect } from "./space-category-select";

type CreateSpaceFormState = {
  name: string;
  categoryId: string;
  description: string;
  capacityValue: string;
  capacityType: string;
  rules: string;
  isActive: boolean;
  amenityIds: string[];
  images: VenueImage[];
  coverImageId: string | null;
};

const defaultFormState: CreateSpaceFormState = {
  name: "",
  categoryId: "",
  description: "",
  capacityValue: "",
  capacityType: CapacityType.PEOPLE,
  rules: "",
  isActive: true,
  amenityIds: [],
  images: [],
  coverImageId: null,
};

type CreateSpaceFormProps = {
  venueId: string;
};

export function CreateSpaceForm({ venueId }: CreateSpaceFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<CreateSpaceFormState>(defaultFormState);
  const [categories, setCategories] = useState<SpaceCategoryResponse[]>([]);
  const [capacityTypes, setCapacityTypes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getSpaceCategories().then(setCategories);
    getCapacityTypes().then(setCapacityTypes);
  }, []);

  const selectedCategory = categories.find(
    (category) => category.id === form.categoryId
  );

  function updateField<K extends keyof CreateSpaceFormState>(
    field: K,
    value: CreateSpaceFormState[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleFilesSelected(files: FileList) {
    const newImages = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => createImageFromFile(file));

    if (newImages.length === 0) {
      return;
    }

    setForm((current) => {
      const nextImages = [...current.images, ...newImages];
      const shouldSetCover =
        !current.coverImageId ||
        !current.images.some((image) => image.id === current.coverImageId);

      return {
        ...current,
        images: nextImages,
        coverImageId: shouldSetCover ? newImages[0].id : current.coverImageId,
      };
    });
  }

  function handleSaveDraft() {
    toast.info("Save draft is coming soon.");
  }

  async function handleCreateSpace() {
    if (!form.name.trim()) {
      toast.error("Space name is required.");
      return;
    }

    if (!form.categoryId) {
      toast.error("Please select a category.");
      return;
    }

    try {
      setIsSubmitting(true);

      const blobImages = form.images.filter((image) => image.url.startsWith("blob:"));

      for (const image of blobImages) {
        const response = await fetch(image.url);
        const blob = await response.blob();
        const file = new File([blob], image.id, { type: blob.type });
        await uploadFile(file);
      }

      const createdImages = await createImages(
        blobImages.map((image) => ({
          url: image.id,
          altText: image.alt,
        }))
      );

      const uploadedIds = blobImages.map((image, index) => ({
        localId: image.id,
        serverId: createdImages[index]?.id ?? "",
      }));

      const spaceImageIds = orderImageIdsWithCoverFirst(
        form.images,
        form.coverImageId,
        uploadedIds
      );

      await createSpace(venueId, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        rules: form.rules.trim() || undefined,
        capacityValue: form.capacityValue ? Number(form.capacityValue) : undefined,
        capacityType: form.capacityType || undefined,
        isActive: form.isActive,
        categoryId: form.categoryId,
        spaceAmenityIds: form.amenityIds,
        spaceImageIds,
      });

      toast.success("Space created successfully.");
      router.push(`/my-venues/${venueId}`);
    } catch (error) {
      console.error(error);
      toast.error((error as Error)?.message || "Failed to create space.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-10 animate-spin text-surface-tint" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          <FormSectionCard title="Basic Information" icon={Info}>
            <div className="flex flex-col gap-5">
              <IconInput
                label="Space Name"
                name="name"
                placeholder="e.g. Skyline Meeting Room"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
              <SpaceCategorySelect
                categories={categories}
                value={form.categoryId}
                onChange={(categoryId) => updateField("categoryId", categoryId)}
              />
              <div className="flex flex-col gap-2">
                <Label htmlFor="description" className="text-sm font-medium text-on-surface">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the ambiance, typical uses, and unique features of this space..."
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>
          </FormSectionCard>

          <FormSectionCard title="Capacity" icon={Users}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="capacityValue" className="text-sm font-medium text-on-surface">
                  Capacity Value
                </Label>
                <Input
                  id="capacityValue"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.capacityValue}
                  onChange={(event) => updateField("capacityValue", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="capacityType" className="text-sm font-medium text-on-surface">
                  Capacity Type
                </Label>
                <Select
                  value={form.capacityType}
                  onValueChange={(value) => updateField("capacityType", value)}
                >
                  <SelectTrigger id="capacityType" className="w-full">
                    <SelectValue placeholder="Select capacity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {capacityTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {capacityTypeLabels[type as CapacityType] ?? type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FormSectionCard>

          <FormSectionCard title="Amenities" icon={Check}>
            <SpaceAmenitySection
              selectedIds={form.amenityIds}
              onChange={(amenityIds) => updateField("amenityIds", amenityIds)}
            />
          </FormSectionCard>

          <FormSectionCard title="Rules & Restrictions" icon={Gavel}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="rules" className="text-sm font-medium text-on-surface">
                Space Specific Rules
              </Label>
              <Textarea
                id="rules"
                name="rules"
                placeholder="No external catering, 24-hour cancellation required, maximum noise level 80dB..."
                value={form.rules}
                onChange={(event) => updateField("rules", event.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
          </FormSectionCard>

          <FormSectionCard title="Photos" icon={Camera}>
            <div className="flex flex-col gap-6">
              <VenueImageUploadZone
                onFilesSelected={handleFilesSelected}
                title="Drop images here"
                description="Support JPG, PNG and WEBP. Max size 5MB each."
                buttonLabel="Select Files from Device"
              />
              <VenueImageGallery
                images={form.images}
                coverImageId={form.coverImageId}
                onImagesChange={(images) => updateField("images", images)}
                onCoverChange={(coverImageId) => updateField("coverImageId", coverImageId)}
              />
            </div>
          </FormSectionCard>

          <FormSectionCard title="Visibility" icon={Eye}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-on-surface">Visibility</span>
                <span className="text-sm text-on-surface-variant">
                  Set this space to active to make it public.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-on-surface">
                  {form.isActive ? "Active" : "Inactive"}
                </span>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) => updateField("isActive", checked)}
                />
              </div>
            </div>
          </FormSectionCard>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <CreateSpacePreviewPanel
            name={form.name}
            categoryName={selectedCategory?.name ?? null}
            capacityValue={form.capacityValue}
            capacityType={form.capacityType}
            amenityCount={form.amenityIds.length}
            images={form.images}
            coverImageId={form.coverImageId}
            description={form.description}
            rules={form.rules}
          />
        </div>
      </div>

      <CreateSpaceFormActions
        venueId={venueId}
        isSubmitting={isSubmitting}
        onSaveDraft={handleSaveDraft}
        onCreateSpace={handleCreateSpace}
      />
    </div>
  );
}
