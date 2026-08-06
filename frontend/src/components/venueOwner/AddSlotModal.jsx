import { useState } from "react";
import { useForm } from "react-hook-form";

function timeStringToMinutes(value) {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-sm text-red-600">{error.message}</p>;
}

function inputCls(hasError) {
  return (
    "w-full rounded-lg border px-3 py-2 text-sm " +
    (hasError ? "border-red-400" : "border-gray-300")
  );
}

export function AddSlotModal({ onClose, onCreate }) {
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    setSubmitError("");

    const payload = {
      label: data.label.trim(),
      startTime: timeStringToMinutes(data.startTime),
      endTime: timeStringToMinutes(data.endTime),
      price: data.price,
    };

    try {
      await onCreate(payload);
    } catch (err) {
      const overlapping = err.data?.data?.overlappingSlots;
      if (overlapping?.length) {
        setSubmitError(`Overlaps with: ${overlapping.map((s) => s.label).join(", ")}`);
      } else {
        setSubmitError(err.data?.message || err.message || "Failed to create slot.");
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="font-semibold text-gray-900">Add Slot</h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Slot name</label>
            <input
              type="text"
              placeholder="e.g. Morning"
              className={inputCls(errors.label)}
              {...register("label", { required: "Slot name is required" })}
            />
            <FieldError error={errors.label} />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Start time</label>
              <input
                type="time"
                className={inputCls(errors.startTime)}
                {...register("startTime", { required: "Start time is required" })}
              />
              <FieldError error={errors.startTime} />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">End time</label>
              <input
                type="time"
                className={inputCls(errors.endTime)}
                {...register("endTime", { required: "End time is required" })}
              />
              <FieldError error={errors.endTime} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 5000"
              className={inputCls(errors.price)}
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 1, message: "Price must be greater than 0" },
              })}
            />
            <FieldError error={errors.price} />
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Adding…" : "Add Slot"}
          </button>
        </form>
      </div>
    </div>
  );
}
