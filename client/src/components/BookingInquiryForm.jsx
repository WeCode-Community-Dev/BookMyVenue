function BookingInquiryForm() {
  const handleSubmit = (e) => {
    e.preventDefault();

    // later you will connect backend API here
    alert("Booking Inquiry Submitted!");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#faf7f5] px-4 py-8">
      <div className="w-full max-w-[450px] bg-white p-10 rounded-3xl shadow-lg text-center">
        <h2 className="text-[#4a1625] text-3xl font-bold mb-2">
          Booking Inquiry
        </h2>

        <p className="text-gray-500 mb-6">
          Fill the form to request a venue booking
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          />

          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            required
            className="w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          />

          <input
            type="date"
            required
            className="w-full p-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          />

          <textarea
            placeholder="Event Details (wedding, party, meeting etc.)"
            rows={5}
            required
            className="w-full p-3.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-[#8b1e2d] focus:ring-4 focus:ring-[#8b1e2d]/15"
          />

          <button
            type="submit"
            className="w-full p-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-[#8b1e2d] to-[#4a1625] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          >
            Submit Inquiry
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookingInquiryForm;