import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getProviderVenueById, updateVenue, } from "../../services/venueService";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import VenueForm from "../../components/provider/venue-form/VenueForm";
import { mapVenueToFormValues } from "../../utils/venueForm";

const EditVenue = () => {
  const { id: venueId } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchVenue = async () => {
    if (!venueId) {
      setFetchError("Invalid venue link.");
      setInitialValues(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setFetchError("");

      const data = await getProviderVenueById(venueId);

      if (!data.success) {
        setFetchError(data.message || "Venue not found.");
        return;
      }

      setInitialValues(mapVenueToFormValues(data.data));
      setExistingImages(
        (data.data.images || []).map((img) => ({
          url: img.url,
          key: img.public_id || img.url,
        }))
      );
    } catch (err) {
      setFetchError(
        err.response?.data?.message ||
        "Unable to load venue. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (venueId) {
      fetchVenue();
    }
  }, [venueId]);

  const formKey = useMemo(
    () => (initialValues ? `${venueId}-loaded` : "loading"),
    [initialValues, venueId]
  );

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setSubmitError("");

      const data = await updateVenue(venueId, formData);

      if (!data.success) {
        throw new Error(data.message || "Failed to update venue.");
      }

      toast.success(data.message || "Venue updated successfully.");
      navigate("/provider/venues");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update venue. Please try again.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader label="Loading venue..." />;
  }

  if (fetchError || !initialValues) {
    return (
      <ErrorState message={fetchError || "Venue not found."} onRetry={fetchVenue} />
    );
  }

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Edit Venue
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Update your venue listing details.
        </p>
      </div>

      <VenueForm
        key={formKey}
        mode="edit"
        initialValues={initialValues}
        existingImages={existingImages}
        submitError={submitError}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/provider/venues")}
        submitLabel="Save Changes"
        submittingLabel="Updating..."
      />
    </>
  );
};

export default EditVenue;
