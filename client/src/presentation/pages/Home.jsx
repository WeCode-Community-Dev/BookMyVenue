import {
  MapPin,
  Calendar,
  Users,
  Search,
} from "lucide-react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const featuredVenues = [
  {
    name: "Grand Ballroom Palace",
    type: "Wedding Hall",
    location: "Mumbai, Maharashtra",
    rating: "4.9",
    reviews: "324",
    price: "₹80,000",
    capacity: "500-800 guests",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
  },
  {
    name: "Sky Terrace Lounge",
    type: "Rooftop Venue",
    location: "Bangalore, Karnataka",
    rating: "4.8",
    reviews: "198",
    price: "₹45,000",
    capacity: "100-200 guests",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf",
  },
  {
    name: "Modern Conference Hub",
    type: "Conference Room",
    location: "Gurgaon, Delhi NCR",
    rating: "4.7",
    reviews: "156",
    price: "₹25,000",
    capacity: "50-150 guests",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
  },
  {
    name: "Elegant Banquet Hall",
    type: "Banquet Hall",
    location: "Pune, Maharashtra",
    rating: "4.9",
    reviews: "267",
    price: "₹65,000",
    capacity: "300-500 guests",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
  },
];

const categories = [
  {
    title: "Wedding Halls",
    count: "1,200+",
    icon: "🏩",
  },
  {
    title: "Conference Rooms",
    count: "850+",
    icon: "🏢",
  },
  {
    title: "Banquet Halls",
    count: "950+",
    icon: "🎉",
  },
  {
    title: "Coworking Spaces",
    count: "620+",
    icon: "💼",
  },
  {
    title: "Rooftop Venues",
    count: "340+",
    icon: "🏙️",
  },
  {
    title: "Party Halls",
    count: "780+",
    icon: "🎊",
  },
  {
    title: "Studios",
    count: "450+",
    icon: "📷",
  },
  {
    title: "Auditoriums",
    count: "290+",
    icon: "🎭",
  },
];

const reviews = [
        {
          name:"Priya Sharma",
          role:"Wedding Client",
          text:"Book My Venue made our wedding planning so much easier! We found the perfect venue within our budget and the booking process was seamless.",
          initials:"PS",
          color:"bg-blue-400"
        },

        {
          name:"Rajesh Kumar",
          role:"Corporate Event Manager",
          text:"As a corporate event planner, I rely on Book My Venue for all our conferences. The variety and quality of venues is exceptional.",
          initials:"RK",
          color:"bg-orange-400"
        },

        {
          name:"Anita Desai",
          role:"Birthday Party Host",
          text:"Found an amazing rooftop venue for my daughter's birthday. The photos, reviews, and booking system made everything stress-free!",
          initials:"AD",
          color:"bg-green-400"
        }

      ]

export default function Home() {
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

          <div className="bg-white rounded-2xl p-4 mt-14 max-w-5xl mx-auto shadow-xl">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="flex items-center gap-3 bg-gray-100 px-4 py-4 rounded-xl">
                <MapPin className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Location"
                  className="bg-transparent outline-none text-black w-full"
                />
              </div>

              <div className="flex items-center gap-3 bg-gray-100 px-4 py-4 rounded-xl">
                <Calendar className="text-gray-500" />
                <input
                  type="date"
                  className="bg-transparent outline-none text-black w-full"
                />
              </div>

              <div className="flex items-center gap-3 bg-gray-100 px-4 py-4 rounded-xl">
                <Users className="text-gray-500" />
                <input
                  type="number"
                  placeholder="Guest Count"
                  className="bg-transparent outline-none text-black w-full"
                />
              </div>

              <button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold">
                <Search size={20} />
                Search Venues
              </button>
            </div>
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
              Browse by Category
            </h2>

            <p className="text-xl text-gray-500 mt-4">
              Find the perfect space for any occasion
            </p>
          </div>

          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white border rounded-2xl p-8 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="text-5xl mb-5">{category.icon}</div>

                <h3 className="text-2xl font-semibold mb-2">
                  {category.title}
                </h3>

                <p className="text-gray-500">{category.count}</p>
              </div>
            ))}
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
            <button className=" border  px-7  py-3  rounded-xl  bg-white font-semibold flex items-center gap-2 hover:shadow">
              View All →
            </button>
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {featuredVenues.map((venue,index)=>(
              <div
                key={index}
                className=" bg-white rounded-3xl overflow-hidden border hover:shadow-xl transition">
                <div className="relative">
                  <img src={venue.image} alt={venue.name} className=" h-64 w-full object-cover"/>
                  <button className=" absolute right-4 top-4 bg-white rounded-full w-11 h-11 flex items-center justify-center shadow">
                    🤍
                  </button>
                  <span className=" absolute bottom-4 left-4 bg-amber-500 px-4 py-2 rounded-full text-sm font-semibold">
                    {venue.type}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-amber-500">
                      ⭐
                    </span>
                    <span className="font-semibold">
                      {venue.rating}
                    </span>
                    <span className="text-gray-500">
                      ({venue.reviews})
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{venue.name}</h3>
                  <p className="text-gray-500 border-b pb-4">
                    📍 {venue.location}
                  </p>
                  <div className="flex justify-between mt-5">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Starting from
                      </p>
                      <p className="font-bold text-xl">
                        {venue.price}<span className="text-sm font-normal">/day</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">
                        Capacity
                      </p>
                      <p className="font-semibold">
                        {venue.capacity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-24">
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
      </section>

      <section className="bg-gradient-to-r from-slate-950 to-slate-900 text-white py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold">
            Ready to Host Your Event?
          </h2>
          <p className="text-xl text-gray-300 mt-5">
            Start exploring thousands of verified venues across India
          </p>
          <div className="flex justify-center gap-5 mt-10">
            <button className="bg-amber-500 text-black px-10 py-4 rounded-xl font-semibold text-lg">
              Browse Venues →
            </button>
            <button className=" border border-white px-10 py-4 rounded-xl font-semibold text-lg">
              List Your Venue
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}