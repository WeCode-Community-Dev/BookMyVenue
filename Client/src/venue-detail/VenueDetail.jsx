import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { venues } from "../venue-list/venuesData";
import VenueNavbar from "../venue-list/VenueNavbar";
import ImageGallery from "./ImageGallery";
import VenueHeader from "./VenueHeader";
import VenueFeatures from "./VenueFeatures";
import VenueAbout from "./VenueAbout";
import VenueAmenities from "./VenueAmenities";
import BookingCard from "./BookingCard";
import ActionModals from "./ActionModals";
import AXIOS_API from "../Api/api";
import RegisterModal from "./RegisterModal";
import useAuth from "../Auth/useAuth";

export function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [modalType, setModalType] = useState(null);
  const [registerModal, setRegisterModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [bookedDates, setBookedDates] = useState([]);
  const [orgId, setOrgId] = useState("");

  const { user } = useAuth();

  const venueDetails = async () => {
    try {
      const response = await AXIOS_API.get(`/api/v2/list/getOne/${id}`);

      setData(response.data.venue);
      setOrgId(response.data.venue.organiZerId);
      setFinalPrice(response.data.venue.price);
    } catch (error) {
      console.log(error);
    }
  };

  const bookedDetails = async () => {
    try {
      const details = await AXIOS_API.get(`/api/v2/list/${id}/booked-dates`);
      const formattedDates = details?.data?.map((range) => ({
        from: new Date(range.startDate.substring(0, 10)),
        to: new Date(range.endDate.substring(0, 10)),
      }));

      setBookedDates(formattedDates);
    } catch (error) {
      console.log(error?.data);
    }
  };

  const venue = venues.find((v) => v.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    venueDetails();
    bookedDetails();
  }, [id]);

  if (!venue) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-[#D4CEB8] via-[#F4F1E6] to-[#FAF9F6] font-sans
       flex flex-col items-center justify-center p-6 text-center venue-detail-page"
      >
        <div className="bg-[#F7F5EE] border border-slate-200 rounded-[2rem] p-8 max-w-sm w-full shadow-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Venue Not Found
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            The listing you are trying to view does not exist or has been
            removed.
          </p>
          <Link
            to="/venues"
            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs
             py-3 px-6 rounded-xl shadow-sm transition-colors active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full font-sans bg-gradient-to-b from-[#D4CEB8] via-[#F4F1E6] to-[#FAF9F6]
     text-slate-800 selection:bg-ticket-yellow selection:text-slate-900 pb-20 relative overflow-x-hidden venue-detail-page"
    >
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-ticket-orange/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-ticket-yellow/10 rounded-full blur-[140px] pointer-events-none"></div>

      <VenueNavbar />

      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-6 relative z-10">
        <div className="mb-6 flex items-center justify-between animate-fade-in-up-stagger delay-75">
          <Link
            to="/venues"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-ticket-orange transition-colors duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Listings</span>
          </Link>
        </div>

        <section className="mb-8 animate-fade-in-up-stagger delay-150">
          <ImageGallery image={data.image} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <section className="bg-white/50 border border-slate-200/50 rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] animate-fade-in-up-stagger delay-225">
              <VenueHeader data={data} />
            </section>

            <section className="bg-white/50 border border-slate-200/50 rounded-[2rem] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] animate-fade-in-up-stagger delay-375">
              <VenueAbout data={data} />
            </section>

            <section className="animate-fade-in-up-stagger delay-450">
              <VenueAmenities data={data.spec} />
            </section>
          </div>

          <div className="lg:col-span-1 animate-fade-in-up-stagger delay-300">
            <BookingCard
              data={data}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
              finalPrice={finalPrice}
              setFinalPrice={setFinalPrice}
              onOpenRegister={() => setRegisterModal(true)}
              bookedDates={bookedDates}
            />
          </div>
        </div>
      </main>

      {registerModal && (
        <RegisterModal
          onClose={() => setRegisterModal(false)}
          bookingData={{
            date: selectedDate,
            days: selectedDays,
            totalPrice: finalPrice,
            venueName: data?.name,
            venueId: data?._id,
            orgId: orgId
          }}
          user={user}
        />
      )}

      {modalType && (
        <ActionModals
          type={modalType}
          venue={venue}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}

export default VenueDetail;
