import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { bookingsApi } from "@/api/bookings";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { apiErrorMessage } from "@/api/client";
import { formatCurrency } from "@/lib/utils";

const schema = z
  .object({
    start_at: z.string().min(1, "Start is required"),
    hours: z.coerce.number().min(1).max(24),
  })
  .refine((d) => new Date(d.start_at) > new Date(), {
    message: "Start must be in the future",
    path: ["start_at"],
  });

type FormData = z.infer<typeof schema>;

export function BookingForm({
  venueId,
  pricePerHour,
}: {
  venueId: number;
  pricePerHour: number;
}) {
  const navigate = useNavigate();
  const [estimated, setEstimated] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { hours: 1 },
  });

  const hours = Number(watch("hours") || 1);
  const estimate = hours * pricePerHour;

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const start = new Date(data.start_at);
      const end = new Date(start.getTime() + data.hours * 3600 * 1000);
      return bookingsApi.create({
        venue_id: venueId,
        start_at: start.toISOString(),
        end_at: end.toISOString(),
      });
    },
    onSuccess: () => {
      setEstimated(null);
      navigate("/bookings");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((d) => {
        setEstimated(d.hours * pricePerHour);
        mutation.mutate(d);
      })}
      className="flex flex-col gap-4"
    >
      <div>
        <Label htmlFor="start_at">Start date & time</Label>
        <Input id="start_at" type="datetime-local" {...register("start_at")} />
        {errors.start_at && (
          <p className="mt-1 text-xs text-red-600">{errors.start_at.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="hours">Duration (hours)</Label>
        <Input id="hours" type="number" min={1} max={24} {...register("hours")} />
        {errors.hours && (
          <p className="mt-1 text-xs text-red-600">{errors.hours.message}</p>
        )}
      </div>

      <div className="rounded-md bg-gray-50 p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Estimated total</span>
          <span className="font-semibold">{formatCurrency(estimate)}</span>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Payment is processed securely (mock) once the owner confirms.
        </p>
        {estimated != null && (
          <p className="mt-1 text-xs text-brand-600">
            Confirming at {formatCurrency(estimated)}...
          </p>
        )}
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-600">{apiErrorMessage(mutation.error)}</p>
      )}

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Requesting booking..." : "Request booking"}
      </Button>
    </form>
  );
}
