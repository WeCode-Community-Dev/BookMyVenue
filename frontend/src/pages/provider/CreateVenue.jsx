import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createVenue } from "../../services/venueService";
import VenueForm from "../../components/provider/venue-form/VenueForm";
import { EMPTY_VENUE_FORM } from "../../utils/venueForm";

const CreateVenue = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setSubmitError("");

      const data = await createVenue(formData);

      if (!data.success) {
        throw new Error(data.message || "Failed to create venue.");
      }

      toast.success(data.message || "Venue created successfully.");

      const newVenueId = data.data?._id;
      if (newVenueId) {
        navigate(`/provider/venues/${newVenueId}/availability`);
      } else {
        navigate("/provider/venues");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to create venue. Please try again.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          Create Venue
        </h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Add a new venue to your provider inventory.
        </p>
      </div>

      <VenueForm
        mode="create"
        initialValues={EMPTY_VENUE_FORM}
        submitError={submitError}
        submitting={submitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/provider/venues")}
        submitLabel="Create Venue"
        submittingLabel="Creating..."
      />
    </>
  );
};

export default CreateVenue;
