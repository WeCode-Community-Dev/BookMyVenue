import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constatnts/routes";
import { VenueCategory } from "@/constatnts/Venue";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTopVenues } from "@/redux/slices/UserVenueSlice";
import VenueCard from "../components/common/VenueCard";

export default function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { venues } = useSelector((state) => state.userVenue)

  useEffect(()=> {
    dispatch(getTopVenues())
  }, [dispatch])

  
  return (
    <div className="bg-white">
      <Header />
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-block bg-amber-500/20 text-amber-400 px-5 py-2 rounded-full mb-8">
            ✨ India's #1 Venue Booking Platform
          </span>

          <h1 className="text-6xl font-bold leading-tight">
            Discover Your Perfect
            <br />
            <span className="text-amber-500">Event Venue</span>
          </h1>

          <p className="text-xl text-gray-300 mt-8 max-w-3xl mx-auto">
            From intimate gatherings to grand celebrations, find and book
            the ideal venue for your special moments.
          </p>

        <div className="mt-14 flex justify-center">
          <button
            onClick={() => navigate(ROUTES.USER.BROWSE_VENUES)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-4 rounded-xl 
            flex items-center justify-center gap-2 font-semibold text-lg shadow-lg transition"
          >
            Explore Venues
          </button>
        </div>
          <div className="flex justify-center gap-12 mt-12 text-gray-300">
            <div>✓ Verified Venues</div>
            <div>⭐ 4.8 Rating</div>
            <div>🏛️ 5000+ Venues</div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900">
              Find the Perfect Venue for Your Event
            </h2>

            <p className="text-xl text-gray-500 mt-4">
              Explore our categories and discover spaces that match your celebration
            </p>
          </div>

          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
            {VenueCategory.map((category) => (
              <div
                key={category}
                className="bg-white border rounded-2xl p-8 hover:shadow-lg transition-all"
              >
                <h3 className="text-2xl font-semibold">
                  {category}
                </h3>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-14">
            <button
              onClick={() => navigate(ROUTES.USER.BROWSE_VENUES)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-4 rounded-xl font-semibold text-lg transition"
            >
              Browse Venues
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-5xl font-bold text-slate-900">
                Featured Venues
              </h2>
              <p className="text-lg text-gray-500 mt-3">
                Handpicked premium venues for your events
              </p>
            </div>
            <button onClick={() => navigate(ROUTES.USER.BROWSE_VENUES)} className=" border  px-7  py-3  rounded-xl  bg-white font-semibold flex items-center gap-2 hover:shadow">
              View All →
            </button>
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {venues.map((venue)=>(
              <VenueCard 
                  key={venue.id}
                  venue={venue}
              />
              // <div
              //   key={venue.id}
              //   onClick={() => navigate(`/user/venue/${venue._id}`)}
              //   className=" cursor-pointer bg-white rounded-3xl overflow-hidden border hover:shadow-xl transition">
              //   <div className="relative">
              //     <img src={venue.images?.[0]?.url} alt={venue.name} className=" h-64 w-full object-cover"/>
              //     <button className=" absolute right-4 top-4 bg-white rounded-full w-11 h-11 flex items-center justify-center shadow">
              //       🤍
              //     </button>
              //     <span className=" absolute bottom-4 left-4 bg-amber-500 px-4 py-2 rounded-full text-sm font-semibold">
              //       {venue.category}
              //     </span>
              //   </div>
              //   <div className="p-6">
              //     <div className="flex items-center gap-2 mb-4">
              //       <span className="text-amber-500">
              //         ⭐
              //       </span>
              //       <span className="font-semibold">
              //         {venue.rating}
              //       </span>
              //       {/* <span className="text-gray-500">
              //         ({venue.reviews})
              //       </span> */}
              //     </div>
              //     <h3 className="text-xl font-bold text-slate-900 mb-3">{venue.name}</h3>
              //     <p className="text-gray-500 border-b pb-4">
              //       📍 {venue.address.city}, {venue.address.state}
              //     </p>
              //     <div className="flex justify-between mt-5">
              //       <div>
              //         <p className="text-gray-500 text-sm">
              //           Starting from
              //         </p>

              //         <p className="font-bold text-xl">
              //           ₹{venue.pricePerDay}
              //           <span className="text-sm font-normal">/day</span>
              //         </p>
              //       </div>

              //       <div className="text-right">
              //         <p className="text-gray-500 text-sm">
              //           Capacity
              //         </p>

              //         <p className="font-bold text-md">
              //           {venue.seatingCapacity}
              //           <span className="text-sm text-gray-400"> Seating</span>
              //         </p>

              //         <p className="font-bold text-md">
              //           {venue.standingCapacity}
              //           <span className="text-sm text-gray-400"> Standing</span>
              //         </p>
              //       </div>
              //     </div>
              //   </div>
              // </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-900">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-500 mt-4">
              Join thousands of satisfied event organizers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {reviews.map((review,index)=>(
              <div
                key={index}
                className=" bg-white border rounded-3xl p-8">
                <div className="text-3xl text-amber-500 mb-6">
                  ★★★★★
                </div>
                <p className="text-gray-600 text-lg leading-8">
                  {review.text}
                </p>
                <div className="flex items-center gap-4 mt-8">
                  <div className={` ${review.color} w-14 h-14 rounded-full flex items-center justify-center text-white text-xl `}>
                    {review.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {review.name}
                    </h3>
                    <p className="text-gray-500">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section className="bg-gradient-to-r from-slate-950 to-slate-900 text-white py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold">
            Ready to Host Your Event?
          </h2>
          <p className="text-xl text-gray-300 mt-5">
            Start exploring thousands of verified venues across India
          </p>
          <div className="flex justify-center gap-5 mt-10">
            <button onClick={() => navigate(ROUTES.USER.BROWSE_VENUES)} className="bg-amber-500 text-black px-10 py-4 rounded-xl font-semibold text-lg">
              Browse Venues →
            </button>
            <button onClick={() => navigate(ROUTES.VENDOR.VENUES)} className=" border border-white px-10 py-4 rounded-xl font-semibold text-lg">
              List Your Venue
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}