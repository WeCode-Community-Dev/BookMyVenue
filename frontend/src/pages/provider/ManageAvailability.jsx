import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { getProviderVenueById } from "../../services/venueService";
import { activateAvailability, createAvailability, deactivateAvailability, getVenueAvailability, } from "../../services/availabilityService";
import ConfirmModal from "../../components/common/ConfirmModal";
import ErrorState from "../../components/common/ErrorState";
import CreateAvailabilityCard from "../../components/provider/availability/CreateAvailabilityCard";
import VenueAvailabilityHeader from "../../components/provider/availability/VenueAvailabilityHeader";
import AvailabilityListGrouped from "../../components/provider/availability/AvailabilityListGrouped";
import AvailabilitySkeleton from "../../components/provider/availability/AvailabilitySkeleton";
import AvailabilitySummary from "../../components/provider/availability/AvailabilitySummary";
import {
  areAllSlotsExpiredForToday, filterNonExpiredPresetIds, getPredefinedSlotById, getTodayDateInputValue,
  groupSlotsByDate, getProviderAvailabilityEmptyState, getAvailabilityStats, resolveSlotSelection,
} from "../../utils/predefinedSlots";

const ManageAvailability = () => {
  const { id: venueId } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [error, setError] = useState("");
  const [slotsError, setSlotsError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlotIds, setSelectedSlotIds] = useState([]);
  const [dateError, setDateError] = useState("");
  const [selectionError, setSelectionError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingSlotId, setProcessingSlotId] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const fetchVenue = useCallback(async () => {
    if (!venueId) {
      setError("Invalid venue link.");
      setVenue(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getProviderVenueById(venueId);

      if (!data.success) {
        setVenue(null);
        setError(data.message || "Venue not found.");
        return;
      }

      setVenue(data.data);
    } catch (err) {
      setVenue(null);
      setError(
        err.response?.data?.message ||
        "Unable to load venue details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [venueId]);

  const fetchSlots = useCallback(async () => {
    if (!venueId) return;

    try {
      setSlotsLoading(true);
      setSlotsError("");

      const data = await getVenueAvailability(venueId);

      if (data.success) {
        setSlots(Array.isArray(data.data) ? data.data : []);
      } else {
        setSlots([]);
        setSlotsError(data.message || "Failed to load availability.");
      }
    } catch (err) {
      setSlots([]);
      setSlotsError(
        err.response?.data?.message ||
        "Unable to load availability. Please try again."
      );
    } finally {
      setSlotsLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    fetchVenue();
    fetchSlots();
  }, [fetchVenue, fetchSlots]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSelectedSlotIds((prev) => {
        const next = filterNonExpiredPresetIds(selectedDate, prev);
        return next.length === prev.length ? prev : next;
      });
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, [selectedDate]);

  useEffect(() => {
    setSelectedSlotIds((prev) => filterNonExpiredPresetIds(selectedDate, prev));
  }, [selectedDate]);

  const groupedSlots = useMemo(() => groupSlotsByDate(slots), [slots]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedSlotIds([]);
    setDateError("");
    setSelectionError("");
    setSubmitError("");
  };

  const handleToggleSlot = (slotId) => {
    const preset = getPredefinedSlotById(slotId);
    if (preset && areAllSlotsExpiredForToday(selectedDate)) {
      setSelectionError("No remaining slots available for today.");
      return;
    }

    setSelectedSlotIds((prev) => resolveSlotSelection(prev, slotId));
    setSelectionError("");
    setSubmitError("");
  };

  const handleCreateAvailability = async (event) => {
    event.preventDefault();

    const minDate = getTodayDateInputValue();
    if (!selectedDate) {
      setDateError("Date is required.");
      return;
    }

    if (selectedDate < minDate) {
      setDateError("Past dates are not allowed.");
      return;
    }

    if (selectedDate < minDate) {
      setDateError("Past dates are not allowed.");
      return;
    }

    if (areAllSlotsExpiredForToday(selectedDate)) {
      setSelectionError("No remaining slots available for today. Choose tomorrow or a later date.");
      return;
    }

    const validSlotIds = filterNonExpiredPresetIds(selectedDate, selectedSlotIds);

    if (validSlotIds.length === 0) {
      setSelectionError(
        areAllSlotsExpiredForToday(selectedDate)
          ? "No remaining slots available for today. Choose tomorrow or a later date."
          : "Select at least one slot."
      );
      return;
    }

    if (validSlotIds.length !== selectedSlotIds.length) {
      setSelectedSlotIds(validSlotIds);
      setSelectionError(
        "One or more selected slots have already ended for today. Please choose a different slot."
      );
      return;
    }

    const presets = validSlotIds
      .map((id) => getPredefinedSlotById(id))
      .filter(Boolean);

    try {
      setIsSubmitting(true);
      setSubmitError("");
      setDateError("");
      setSelectionError("");

      const results = await Promise.allSettled(
        presets.map((preset) =>
          createAvailability({
            venueId,
            date: selectedDate,
            slotLabel: preset.apiLabel,
            startTime: preset.startTime,
            endTime: preset.endTime,
          })
        )
      );

      const failures = results.filter(
        (result) =>
          result.status === "rejected" ||
          (result.status === "fulfilled" && !result.value?.success)
      );

      if (failures.length === results.length) {
        const firstFailure = failures[0];
        const message =
          firstFailure.status === "rejected"
            ? firstFailure.reason?.response?.data?.message ||
            firstFailure.reason?.message
            : firstFailure.value?.message;
        throw new Error(message || "Failed to add availability.");
      }

      await fetchSlots();
      setSelectedSlotIds([]);

      if (failures.length > 0) {
        toast.error("Some slots could not be added. Please review and try again.");
      } else {
        toast.success("Availability added successfully.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to add availability.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivate = async (slot) => {
    if (processingSlotId) return;

    try {
      setProcessingSlotId(slot._id);

      const data = await activateAvailability(slot._id);

      if (!data.success) {
        throw new Error(data.message || "Failed to activate slot.");
      }

      setSlots((prev) =>
        prev.map((item) =>
          item._id === slot._id
            ? { ...item, isActive: data.data?.isActive ?? true }
            : item
        )
      );

      toast.success(data.message || "Slot activated successfully.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Failed to activate slot."
      );
    } finally {
      setProcessingSlotId(null);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivateTarget || processingSlotId) return;

    const slot = deactivateTarget;

    try {
      setProcessingSlotId(slot._id);

      const data = await deactivateAvailability(slot._id);

      if (!data.success) {
        throw new Error(data.message || "Failed to deactivate slot.");
      }

      setSlots((prev) =>
        prev.map((item) =>
          item._id === slot._id
            ? { ...item, isActive: data.data?.isActive ?? false }
            : item
        )
      );

      toast.success(data.message || "Slot deactivated successfully.");
      setDeactivateTarget(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Failed to deactivate slot."
      );
    } finally {
      setProcessingSlotId(null);
    }
  };

  const emptyAvailability = useMemo(
    () => getProviderAvailabilityEmptyState(slots),
    [slots]
  );

  const availabilityStats = useMemo(() => getAvailabilityStats(slots), [slots]);

  const scrollToCreateForm = () => {
    document.getElementById("create-availability")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (loading) {
    return <AvailabilitySkeleton count={2} />;
  }

  if (error || !venue) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/provider/venues")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-red-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to My Venues
        </button>
        <ErrorState message={error || "Venue not found."} onRetry={fetchVenue} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => navigate("/provider/venues")}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-red-600"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to My Venues
      </button>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Manage Availability
        </h1>
        <p className="mt-1 text-base text-gray-500">{venue.title}</p>
      </div>

      <VenueAvailabilityHeader venue={venue} slotCount={slots.length} />

      <CreateAvailabilityCard
        date={selectedDate}
        selectedSlotIds={selectedSlotIds}
        slots={slots}
        dateError={dateError}
        slotsError={selectionError}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onDateChange={handleDateChange}
        onToggleSlot={handleToggleSlot}
        onSubmit={handleCreateAvailability}
      />

      <section className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Your slots
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Grouped by date — activate or deactivate as needed
            </p>
          </div>
          {!slotsLoading && !slotsError && slots.length > 0 && (
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              {slots.length} total
            </span>
          )}
        </div>

        <div className="mt-3 space-y-3">
          {!slotsLoading && !slotsError && slots.length > 0 && (
            <AvailabilitySummary stats={availabilityStats} />
          )}

          {slotsLoading && <AvailabilitySkeleton />}

          {!slotsLoading && slotsError && (
            <ErrorState message={slotsError} onRetry={fetchSlots} />
          )}

          {!slotsLoading && !slotsError && emptyAvailability && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-10 text-center">
              <p className="text-sm font-semibold text-gray-900">
                {emptyAvailability.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {emptyAvailability.description}
              </p>
              {emptyAvailability.showCta && (
                <button
                  type="button"
                  onClick={scrollToCreateForm}
                  className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  Create First Slot
                </button>
              )}
            </div>
          )}

          {!slotsLoading && !slotsError && groupedSlots.length > 0 && (
            <AvailabilityListGrouped
              groups={groupedSlots}
              processingSlotId={processingSlotId}
              onActivate={handleActivate}
              onDeactivate={setDeactivateTarget}
            />
          )}
        </div>
      </section>

      <ConfirmModal
        open={Boolean(deactivateTarget)}
        title="Deactivate slot?"
        message="Guests will no longer be able to book this slot while it is inactive."
        confirmLabel="Deactivate"
        isLoading={Boolean(processingSlotId)}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setDeactivateTarget(null)}
      />
    </div>
  );
};

export default ManageAvailability;
