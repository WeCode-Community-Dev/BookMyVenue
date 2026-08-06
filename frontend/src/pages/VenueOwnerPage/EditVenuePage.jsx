import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VenueForm from "../../components/venueOwner/VenueForm.jsx";
import {
    getVenueOwnerVenueById,
    getVenueForEdit,
    updateVenue,
    submitVenue,
} from "../../services/venueOwner.service.js";
import { showInfo } from "../../utils/toastBus";

export function EditVenuePage() {
    // The URL id is always the ORIGINAL venue's id. For a live (APPROVED) venue
    // we don't edit it in place — we edit an EDIT_DRAFT copy. So `venue` (and the
    // id we autosave/submit against, venue._id) may differ from this URL id, while
    // the address bar keeps showing the original.
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    // Set when an edit copy is already submitted for approval (backend 409).
    const [blocked, setBlocked] = useState(false);

    useEffect(() => {
        async function loadVenue() {
            try {
                const original = await getVenueOwnerVenueById(id);

                // Editing a live venue spawns/returns an EDIT_DRAFT copy; we edit
                // that copy. Every other status is edited in place.
                if (original.status === "APPROVED") {
                    const copy = await getVenueForEdit(id);
                    setVenue(copy);
                } else {
                    setVenue(original);
                }
            } catch (err) {
                // 409 = an edit copy is already in review (CHANGES_PENDING).
                if (err.status === 409) {
                    setBlocked(true);
                } else {
                    setLoadError(err.message || "Failed to load venue.");
                }
            } finally {
                setLoading(false);
            }
        }
        loadVenue();
    }, [id]);

    // Debounced autosave from the form — persists partial draft fields. Targets
    // the doc actually being edited (the copy for a live venue), not the URL id.
    async function handleAutosave(fields) {
        await updateVenue(venue._id, fields);
    }

    // "Submit for Approval". Lets errors propagate so VenueForm can map a
    // missing-fields 400 onto the individual inputs.
    async function handleSubmit(payload) {
        await updateVenue(venue._id, payload);
        await submitVenue(venue._id);
        showInfo("Venue submitted for review");
        navigate("/venue-owner/my-venues");
    }

    function handleContinueLater() {
        navigate("/venue-owner/my-venues");
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-sm text-gray-500">
                Loading venue…
            </div>
        );
    }

    if (blocked) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                <p className="text-sm text-gray-700">
                    Your edits to this venue have already been submitted for approval.
                    You can edit it again once an admin reviews and approves.
                </p>
                <button
                    onClick={() => navigate("/venue-owner/my-venues")}
                    className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-100 cursor-pointer"
                >
                    Back to My Venues
                </button>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="flex items-center justify-center py-20 text-sm text-red-600">
                {loadError}
            </div>
        );
    }

    return (
        <VenueForm
            initialValues={venue}
            onAutosave={handleAutosave}
            onSubmit={handleSubmit}
            onContinueLater={handleContinueLater}
        />
    );
}