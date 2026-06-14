import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../common/MainLayout";

const VenueBookingForm = ({ venue }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "18:00",
    guests: 10,
    eventType: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const adjustGuests = (delta) => {
    setForm((prev) => ({
      ...prev,
      guests: Math.min(500, Math.max(1, prev.guests + delta)),
    }));
  };

  const calcDays = () => {
    if (!form.startDate || !form.endDate) return null;
    const diff =
      (new Date(form.endDate) - new Date(form.startDate)) / 86400000 + 1;
    return diff > 0 ? diff : null;
  };

  const days = calcDays();
  const pricePerDay = venue?.price ?? null;
  const total = days && pricePerDay ? days * pricePerDay : null;

  const handleSubmit = () => {
    // call your booking API here
    console.log("Booking payload:", { venueId: venue.id, ...form });
  };

  return (
    <MainLayout showBack>
      <div className="min-h-screen bg-gray-50 pt-8 px-4 mt-20 mb-10 max-w-xl mx-auto rounded-lg shadow-lg">
        <div>
          {/* Venue banner */}
          <div className="px-5 pt-5 pb-[22px] flex rounded-lg shadow-lg bg-red-600 flex justify-between items-center gap-5 md:gap-8">
            <div><h3 className="text-[1.05rem] text-white font-bold mb-1 tracking-tight">
              hello
            </h3>
            <p className="text-[0.82rem] text-gray-100 font-medium ">
              📍hloocity
            </p>
</div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <p className="text-[0.82rem] text-black font-medium ">
                Type
              </p>
            </div>
          </div>

          <div className="px-6 py-6 ">
            {/* Your details */}
            <section>
              <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-widest mb-3 pb-2 border-b border-gray-100">
                Your details
              </p>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[0.75rem] text-gray-500">
                    First name
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Sara"
                    className="inputClass"
                  />
                </div>
                {/* <div className="flex flex-col gap-1">
                  <label className="text-[0.75rem] text-gray-500">
                    Last name
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Ahmed"
                    className="inputClass"
                  />
                </div> */}
                <div className="flex flex-col gap-1">
                  <label className="text-[0.75rem] text-gray-500">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="sara@example.com"
                    className="inputClass"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.75rem] text-gray-500">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+971 50 000 0000"
                    className="inputClass"
                  />
                </div>
              </div>
            </section>

            {/* Booking details */}
            <section>
             
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[0.75rem] text-gray-500">
                    Start date
                  </label>
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    className="inputClass"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.75rem] text-gray-500">
                    End date
                  </label>
                  <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    className="inputClass"
                  />
                </div>
                {/* <div className="flex flex-col gap-1">
                  <label className="text-[0.75rem] text-gray-500">
                    Start time
                  </label>
                  <input
                    name="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={handleChange}
                    className="inputClass"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.75rem] text-gray-500">
                    End time
                  </label>
                  <input
                    name="endTime"
                    type="time"
                    value={form.endTime}
                    onChange={handleChange}
                    className="inputClass"
                  />
                </div> */}
              </div>

              {/* Guests */}
              <div className="flex flex-col gap-1 mt-3">
                <label className="text-[0.75rem] text-gray-500">
                  Number of guests
                </label>
                
                  <input
                    name="guest"
                    type="number"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="max 200"
                    className="inputClass"
                  />
                
                {/* <div className="flex items-center gap-3 mt-1">
                  <button
                    onClick={() => adjustGuests(-1)}
                    className="w-8 h-8 rounded-full border border-gray-200 text-lg leading-none flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-[0.95rem] font-semibold w-6 text-center">
                    {form.guests}
                  </span>
                  <button
                    onClick={() => adjustGuests(1)}
                    className="w-8 h-8 rounded-full border border-gray-200 text-lg leading-none flex items-center justify-center"
                  >
                    +
                  </button>
                </div> */}
              </div>
            </section>

            {/* Event details */}
            <section>
              {/* <p className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-widest mb-3 pb-2 border-b border-gray-100">
                Event details
              </p> */}
              <div className="flex flex-col gap-1 my-3">
                <label className="text-[0.75rem] text-gray-500">
                  Event type
                </label>
                <select
                  name="eventType"
                  value={form.eventType}
                  onChange={handleChange}
                  className="inputClass"
                >
                  <option value="">Select an event type</option>
                  <option>Corporate meeting</option>
                  <option>Birthday party</option>
                  <option>Wedding reception</option>
                  <option>Product launch</option>
                  <option>Private dinner</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[0.75rem] text-gray-500">
                  Special requests
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Setup preferences, dietary needs, or anything else..."
                  className="inputClass resize-none"
                />
              </div>
            </section>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-[0.82rem]">
                <span className="text-gray-500">Venue rate</span>
                <span className="font-medium">
                  {pricePerDay
                    ? `${venue.currency ?? "AED"} ${pricePerDay} / day`
                    : "Price TBD"}
                </span>
              </div>
              <div className="flex justify-between text-[0.82rem]">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">
                  {days ? `${days} ${days === 1 ? "day" : "days"}` : "—"}
                </span>
              </div>
              <div className="flex justify-between text-[0.95rem] font-semibold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>
                  {total
                    ? `${venue.currency ?? "AED"} ${total.toLocaleString()}`
                    : "—"}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="btn-primary items-center justify-center w-full !py-[12px] !text-[0.95rem] mt-4"
            >
              Confirm booking
            </button>

            <p className="text-[0.72rem] text-gray-400 text-center my-4">
              You won't be charged yet. The venue owner will confirm your
              request.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VenueBookingForm;
