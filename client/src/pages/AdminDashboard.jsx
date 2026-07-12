import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Users,
  Calendar,
  Clock,
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  IndianRupee,
} from "lucide-react";

import {
  getAdminVenues,
  updateVenueApprovalStatus,
} from "../services/adminVenueService.js";
import { usePageTitle } from "../hooks/usePageTitle.js";

function AdminDashboard() {
  usePageTitle("Admin Dashboard")
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadVenues = async () => {
      try {
        const result = await getAdminVenues();

        if (isMounted) {
          setVenues(result.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch venues");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVenues();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setActionLoadingId(id);
      setError("");

      const result = await updateVenueApprovalStatus(id, status);

      setVenues((prev) =>
        prev.map((venue) => (venue._id === id ? result.data : venue))
      );

      setSelectedVenue((prev) =>
        prev && prev._id === id ? result.data : prev
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update venue status");
    } finally {
      setActionLoadingId("");
    }
  };

  const stats = useMemo(() => {
    const totalVenues = venues.length;
    const approved = venues.filter((v) => v.status === "approved").length;
    const pending = venues.filter((v) => v.status === "pending").length;
    const rejected = venues.filter((v) => v.status === "rejected").length;

    return {
      totalVenues,
      approved,
      pending,
      rejected,
    };
  }, [venues]);

  const formatStatus = (status = "") => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusClass = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const formatPricingModel = (pricingModel = "") => {
    return pricingModel.replace("per_", "Per ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f5] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f5] p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#4a1625]">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Manage venues, owners and platform approvals.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Total Venues</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {stats.totalVenues}
            </h2>
          </div>
          <Building2 className="text-blue-600" size={35} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Approved</p>
            <h2 className="text-3xl font-bold text-green-600">
              {stats.approved}
            </h2>
          </div>
          <Users className="text-green-600" size={35} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Pending</p>
            <h2 className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </h2>
          </div>
          <Clock className="text-yellow-600" size={35} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500">Rejected</p>
            <h2 className="text-3xl font-bold text-red-600">
              {stats.rejected}
            </h2>
          </div>
          <Calendar className="text-red-600" size={35} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow mt-10 p-6">
        <h2 className="text-2xl font-semibold text-[#4a1625] mb-6">
          Venue Approval Requests
        </h2>

        {venues.length === 0 ? (
          <p className="text-gray-500">No venues found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-gray-600">
                  <th className="py-3">Venue</th>
                  <th>Owner</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {venues.map((venue) => (
                  <tr key={venue._id} className="border-b hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={venue.images?.[0] || "/placeholder-venue.jpg"}
                          alt={venue.name}
                          className="w-14 h-14 object-cover rounded-xl"
                        />

                        <div>
                          <p className="font-medium text-gray-900">
                            {venue.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {venue.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <p>{venue.owner?.name || "Seed/Admin Venue"}</p>
                        <p className="text-sm text-gray-500">
                          {venue.owner?.email || "N/A"}
                        </p>
                      </div>
                    </td>

                    <td>
                      {venue.town}, {venue.district}
                    </td>

                    <td>Up to {venue.capacity || "N/A"} guests</td>

                    <td>
                      ₹{venue.pricing?.basePrice || "N/A"}
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                          venue.status
                        )}`}
                      >
                        {formatStatus(venue.status)}
                      </span>
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedVenue(venue)}
                          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
                        >
                          View
                        </button>

                        {venue.status === "pending" && (
                          <>
                            <button
                              disabled={actionLoadingId === venue._id}
                              onClick={() =>
                                updateStatus(venue._id, "approved")
                              }
                              className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                            >
                              Approve
                            </button>

                            <button
                              disabled={actionLoadingId === venue._id}
                              onClick={() =>
                                updateStatus(venue._id, "rejected")
                              }
                              className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedVenue(null)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedVenue(null)}
              className="absolute top-5 right-5 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow"
            >
              <X size={22} />
            </button>

            <div className="relative">
              <img
                src={selectedVenue.images?.[0] || "/placeholder-venue.jpg"}
                alt={selectedVenue.name}
                className="w-full h-80 object-cover rounded-t-3xl"
              />

              <div className="absolute inset-0 bg-black/40 rounded-t-3xl flex items-end">
                <div className="p-8 text-white">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-800`}
                  >
                    {formatStatus(selectedVenue.status)}
                  </span>

                  <h2 className="text-4xl font-bold mt-4">
                    {selectedVenue.name}
                  </h2>

                  <p className="mt-2 flex items-center gap-2">
                    <MapPin size={18} />
                    {selectedVenue.town}, {selectedVenue.district}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-[#4a1625] mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-7">
                    {selectedVenue.description || "No description provided."}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#4a1625] mb-3">
                    Full Address
                  </h3>
                  <p className="text-gray-600">
                    {selectedVenue.address || "No address provided."}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#4a1625] mb-3">
                    Amenities
                  </h3>

                  {selectedVenue.amenities?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedVenue.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-3 py-2 rounded-xl bg-gray-100 text-gray-700"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No amenities provided.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#4a1625] mb-3">
                    Gallery
                  </h3>

                  {selectedVenue.images?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedVenue.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedVenue.name} ${index + 1}`}
                          className="h-36 w-full object-cover rounded-xl"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No images uploaded.</p>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-[#faf7f5] rounded-2xl p-5">
                  <h3 className="font-bold text-[#4a1625] mb-4">
                    Venue Summary
                  </h3>

                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Category:</strong> {selectedVenue.category}
                    </p>

                    <p>
                      <strong>Capacity:</strong> Up to{" "}
                      {selectedVenue.capacity || "N/A"} guests
                    </p>

                    <p className="flex items-center gap-2">
                      <IndianRupee size={16} />
                      <span>
                        <strong>Starting Price:</strong>{" "}
                        ₹{selectedVenue.pricing?.basePrice || "N/A"}
                      </span>
                    </p>

                    <p>
                      <strong>Pricing Model:</strong>{" "}
                      {formatPricingModel(
                        selectedVenue.pricing?.pricingModel || "per_day"
                      )}
                    </p>

                    <p>
                      <strong>Currency:</strong>{" "}
                      {selectedVenue.pricing?.currency || "INR"}
                    </p>
                  </div>
                </div>

                <div className="bg-[#faf7f5] rounded-2xl p-5">
                  <h3 className="font-bold text-[#4a1625] mb-4">
                    Owner Details
                  </h3>

                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedVenue.owner?.name || "N/A"}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedVenue.owner?.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-[#faf7f5] rounded-2xl p-5">
                  <h3 className="font-bold text-[#4a1625] mb-4">
                    Contact Info
                  </h3>

                  <div className="space-y-3 text-gray-700">
                    {selectedVenue.contactInfo?.phone && (
                      <p className="flex items-center gap-2">
                        <Phone size={16} />
                        {selectedVenue.contactInfo.phone}
                      </p>
                    )}

                    {selectedVenue.contactInfo?.email && (
                      <p className="flex items-center gap-2">
                        <Mail size={16} />
                        {selectedVenue.contactInfo.email}
                      </p>
                    )}

                    {selectedVenue.contactInfo?.website && (
                      <p className="flex items-center gap-2 break-all">
                        <Globe size={16} />
                        {selectedVenue.contactInfo.website}
                      </p>
                    )}

                    {!selectedVenue.contactInfo?.phone &&
                      !selectedVenue.contactInfo?.email &&
                      !selectedVenue.contactInfo?.website && (
                        <p className="text-gray-500">
                          No contact information provided.
                        </p>
                      )}
                  </div>
                </div>

                <div className="bg-[#faf7f5] rounded-2xl p-5">
                  <h3 className="font-bold text-[#4a1625] mb-4">
                    Coordinates
                  </h3>

                  <p className="text-gray-700">
                    <strong>Longitude:</strong>{" "}
                    {selectedVenue.location?.coordinates?.[0] || "N/A"}
                  </p>

                  <p className="text-gray-700 mt-2">
                    <strong>Latitude:</strong>{" "}
                    {selectedVenue.location?.coordinates?.[1] || "N/A"}
                  </p>
                </div>

                {selectedVenue?.status === "pending" ? (
                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => updateStatus(selectedVenue._id, "approved")}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                      Approve Venue
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus(selectedVenue._id, "rejected")}
                      className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                    >
                      Reject Venue
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700">
                    This venue has already been{" "}
                    <span className="font-semibold">{selectedVenue.status}</span>. No further
                    admin action is available unless the owner edits and resubmits it.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;