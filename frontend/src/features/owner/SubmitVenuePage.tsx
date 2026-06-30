import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { venuesApi } from "@/api/venues";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { VENUE_TYPES, type VenueType } from "@/lib/types";
import { apiErrorMessage } from "@/api/client";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum([
    "birthday_hall",
    "cafe",
    "hotel",
    "resort",
    "auditorium",
    "meetup",
    "mall",
    "other",
  ]),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  price_per_hour: z.coerce.number().min(0, "Must be 0 or more"),
  capacity: z.coerce.number().min(1, "Must be at least 1"),
  amenities: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function SubmitVenuePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: "birthday_hall" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      venuesApi.ownerCreate({
        name: data.name,
        type: data.type as VenueType,
        description: data.description,
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        price_per_hour: data.price_per_hour,
        capacity: data.capacity,
        amenities: data.amenities
          ? data.amenities.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        photos: [],
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["owner-venues"] });
      navigate("/owner");
    },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">List a new venue</h1>

      <Card className="p-6">
        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="flex flex-col gap-4"
        >
          <div>
            <Label>Venue name</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select {...register("type")}>
                {VENUE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Capacity</Label>
              <Input type="number" min={1} {...register("capacity")} />
              {errors.capacity && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.capacity.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Address</Label>
            <Input {...register("address")} />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Latitude</Label>
              <Input type="number" step="any" {...register("lat")} />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input type="number" step="any" {...register("lng")} />
            </div>
            <div>
              <Label>Price/hr ($)</Label>
              <Input type="number" step="0.01" min={0} {...register("price_per_hour")} />
              {errors.price_per_hour && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.price_per_hour.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea rows={3} {...register("description")} />
          </div>

          <div>
            <Label>Amenities (comma separated)</Label>
            <Input placeholder="ac, parking, wifi" {...register("amenities")} />
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-600">{apiErrorMessage(mutation.error)}</p>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/owner")}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit for approval"}
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            New venues require admin approval before they appear publicly.
          </p>
        </form>
      </Card>
    </div>
  );
}
