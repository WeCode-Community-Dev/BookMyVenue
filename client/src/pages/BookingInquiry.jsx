import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { getVenueById } from "../services/venueService";
import { createBookingInquiry } from "../services/bookingInquiryService";
import { usePageTitle } from "../hooks/usePageTitle";

function BookingInquiry() {
  usePageTitle("Submit Booking Inquiry");
  const { venueId } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    eventDate: "",
    guestCount: "",
    message: "",
  });

  const getTodayDate = () => {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - timezoneOffset)
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getVenueById(venueId);
        setVenue(result.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch venue");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [venueId]);

  const handleCopyTrackingCode = async () => {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setCopySuccess("Tracking code copied!");

      setTimeout(() => {
        setCopySuccess("");
      }, 2500);
    } catch {
      setCopySuccess("Could not copy. Please copy the code manually.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);
      setError("");
      setSuccessMessage("");

      const result = await createBookingInquiry({
        venueId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        eventDate: formData.eventDate,
        guestCount: formData.guestCount,
        message: formData.message,
      });

      const newTrackingCode = result.data.trackingCode;

      setSuccessMessage(result.message || "Booking inquiry submitted successfully.");
      setTrackingCode(newTrackingCode);

      setFormData({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        eventDate: "",
        guestCount: "",
        message: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit booking inquiry");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading booking page...</p>
      </div>
    );
  }

  if (error && !venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-700 text-xl font-medium">{error}</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#faf8f5] py-16">
      <div className="max-w-5xl mx-auto px-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 text-[#8b1e2d] font-medium hover:underline"
        >
          ← Back to venue
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow p-6">
              <img
                src={venue?.images?.[0] || "/placeholder-venue.jpg"}
                alt={venue?.name}
                className="w-full h-56 object-cover rounded-2xl"
              />

              <h1 className="mt-5 text-2xl font-bold text-gray-900">
                {venue?.name}
              </h1>

              <p className="mt-2 text-gray-600">
                {venue?.town}, {venue?.district}
              </p>

              <p className="mt-4 text-[#8b1e2d] font-semibold">
                Starting from ₹{venue?.pricing?.basePrice}
              </p>

              <p className="mt-2 text-gray-600">
                Capacity: {venue?.capacity?.min} - {venue?.capacity?.max} Guests
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Send Booking Inquiry
              </h2>

              <p className="mt-2 text-gray-500">
                The venue owner will review your request and respond later.
              </p>

              {error && (
                <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">
                  {error}
                </div>
              )}

              {successMessage && trackingCode && (
                <div className="mt-6 rounded-2xl bg-green-50 border border-green-200 p-6">
                  <h2 className="text-xl font-semibold text-green-700">
                    Booking Inquiry Submitted Successfully
                  </h2>

                  <p className="text-gray-600 mt-2">
                    Your request has been sent to the venue owner. The owner will review your
                    inquiry and accept or reject it.
                  </p>

                  <div className="mt-5 bg-white border border-green-200 rounded-xl p-5">
                    <p className="text-sm text-gray-500">Your Tracking Code</p>

                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                      <p className="text-3xl font-bold text-[#8b1e2d] tracking-wide">
                        {trackingCode}
                      </p>

                      <button
                        type="button"
                        onClick={handleCopyTrackingCode}
                        className="px-5 py-2 rounded-xl bg-[#8b1e2d] text-white font-semibold hover:bg-[#6f1824] transition"
                      >
                        Copy Code
                      </button>
                    </div>

                    {copySuccess && (
                      <p className="text-sm text-green-700 mt-3">
                        {copySuccess}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 rounded-xl bg-yellow-50 border border-yellow-200 p-4">
                    <p className="text-yellow-800 font-medium">
                      Important: Please copy or save this tracking code now.
                    </p>

                    <p className="text-gray-600 mt-2">
                      You will need this tracking code and your phone number to check your
                      booking status later. If you leave this page without saving it, you may
                      not be able to retrieve it again.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/check-status"
                      className="text-center px-6 py-3 rounded-xl bg-[#8b1e2d] text-white font-semibold hover:bg-[#6f1824] transition"
                    >
                      Check Booking Status
                    </Link>

                    <Link
                      to="/venues"
                      className="text-center px-6 py-3 rounded-xl border border-[#8b1e2d] text-[#8b1e2d] font-semibold hover:bg-red-50 transition"
                    >
                      Browse More Venues
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                    placeholder="Email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    min={getTodayDate()}
                    required
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Guest Count
                  </label>
                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                    placeholder="Expected guests"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                  placeholder="Tell the owner about your event"
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="mt-8 w-full bg-[#8b1e2d] hover:bg-[#6f1824] text-white py-4 rounded-xl font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitLoading ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookingInquiry;