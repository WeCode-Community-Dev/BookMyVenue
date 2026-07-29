import { useParams, useNavigate } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import { ArrowLeft, Clock, CalendarDays, Loader2, Save } from 'lucide-react';

import { DAYS_OF_WEEK } from '../constants/availability.constants';
import { useAvailabilityForm } from '../hooks/useAvailabilityForm';

const VenueAvailabilityPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    venue,
    loading,
    saving,
    form: {
      register,
      handleSubmit,
      control,
      formState: { errors },
    },
    onSubmit,
  } = useAvailabilityForm(id);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!venue) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/owner/venues')}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted hover:text-foreground transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Availability Configuration</h1>
            <p className="text-sm text-muted mt-1">Configure booking rules for {venue.name}</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Operating Hours Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Clock className="text-primary" size={18} />
                <h2 className="text-lg font-semibold text-foreground">Operating Hours</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    {...register('openingTime')}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {errors.openingTime && (
                    <p className="text-xs text-error mt-1">{errors.openingTime.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    {...register('closingTime')}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {errors.closingTime && (
                    <p className="text-xs text-error mt-1">{errors.closingTime.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Operating Days Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <CalendarDays className="text-primary" size={18} />
                <h2 className="text-lg font-semibold text-foreground">Available Days</h2>
              </div>

              <div>
                <Controller
                  name="availableDays"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-3">
                      {DAYS_OF_WEEK.map((day) => {
                        const isSelected = field.value.includes(day.value);
                        return (
                          <button
                            type="button"
                            key={day.value}
                            onClick={() => {
                              const newValue = isSelected
                                ? field.value.filter((v) => v !== day.value)
                                : [...field.value, day.value];
                              field.onChange(newValue);
                            }}
                            className={`
                              px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
                              ${
                                isSelected
                                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                                  : 'bg-background border border-border text-muted hover:border-primary/50 hover:text-foreground'
                              }
                            `}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.availableDays && (
                  <p className="text-xs text-error mt-1.5">{errors.availableDays.message}</p>
                )}
              </div>
            </section>

            {/* Booking Rules Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Clock className="text-primary" size={18} />
                <h2 className="text-lg font-semibold text-foreground">Booking Rules</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Min Duration (Hours)
                  </label>
                  <input
                    type="number"
                    {...register('minBookingDuration', { valueAsNumber: true })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    min="1"
                  />
                  {errors.minBookingDuration && (
                    <p className="text-xs text-error mt-1">{errors.minBookingDuration.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Max Duration (Hours) <span className="text-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    {...register('maxBookingDuration', {
                      setValueAs: (v) => (v === '' ? null : parseInt(v, 10)),
                    })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="No limit"
                    min="1"
                  />
                  {errors.maxBookingDuration && (
                    <p className="text-xs text-error mt-1">{errors.maxBookingDuration.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Price Per Hour (₹)
                  </label>
                  <input
                    type="number"
                    {...register('pricePerHour', { valueAsNumber: true })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    min="1"
                  />
                  {errors.pricePerHour && (
                    <p className="text-xs text-error mt-1">{errors.pricePerHour.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Buffer Time (Minutes)
                  </label>
                  <input
                    type="number"
                    {...register('bufferTime', { valueAsNumber: true })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Time between bookings"
                    min="0"
                  />
                  <p className="text-[10px] text-muted mt-1">
                    Cleaning/setup time required between bookings
                  </p>
                  {errors.bufferTime && (
                    <p className="text-xs text-error mt-1">{errors.bufferTime.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <button
                type="button"
                onClick={() => navigate('/owner/venues')}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold text-foreground hover:bg-surface transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-accent transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {venue.isAvailabilityConfigured ? 'Update Configuration' : 'Save Configuration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VenueAvailabilityPage;
