import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { getVenueOwnerVenueById } from "../../services/venueOwner.service.js";
import { getVenueSlots, createVenueSlot } from "../../services/slot.service.js";
import { AddSlotModal } from "../../components/venueOwner/AddSlotModal.jsx";

function formatMinutes(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const period = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function ManageSlotsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [venueData, slotsData] = await Promise.all([
          getVenueOwnerVenueById(id),
          getVenueSlots(id),
        ]);
        setVenue(venueData);
        setSlots(slotsData);
      } catch (err) {
        setLoadError(err.message || "Failed to load slots.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleCreate(payload) {
    const slot = await createVenueSlot(id, payload);
    setSlots((prev) => [...prev, slot].sort((a, b) => a.startTime - b.startTime));
    setModalOpen(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-500">
        Loading slots…
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-2 text-gray-600 hover:text-black"
      >
        <ArrowLeft size={22} />
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Manage Slots — {venue?.name || "Venue"}
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <Plus size={16} />
          Add Slot
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        {slots.length === 0 ? (
          <p className="py-10 text-center text-gray-400 text-sm">No slots added yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-xs text-gray-400 uppercase tracking-wide">
                <th className="py-2 px-4 font-medium">Slot Name</th>
                <th className="py-2 px-4 font-medium">Start Time</th>
                <th className="py-2 px-4 font-medium">End Time</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{slot.label}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{formatMinutes(slot.startTime)}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{formatMinutes(slot.endTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <AddSlotModal onClose={() => setModalOpen(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}
