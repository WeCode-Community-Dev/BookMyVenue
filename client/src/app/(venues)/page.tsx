import { TestimonialCard } from "@/src/components/venues/testimonial-card";
import { VenueCard } from "@/src/components/venues/venue-card";
import Link from "next/link";

const MOCK_VENUES = [
  {
    id: "1",
    title: "The Industrial Glasshouse & Garden",
    slug: "industrial-glasshouse",
    imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
    location: "Downtown Chicago, IL",
    capacity: 120,
    pricePerHour: 175,
    rating: 4.9,
    category: "Wedding",
  },
  {
    id: "2",
    title: "Minimalist Brick Loft Studio",
    slug: "brick-loft-studio",
    imageUrl: "https://images.unsplash.com/photo-1522158673376-3c72c299e090?auto=format&fit=crop&q=80&w=800",
    location: "Brooklyn, NY",
    capacity: 45,
    pricePerHour: 95,
    rating: 4.7,
    category: "Workshop",
  },
  {
    id: "3",
    title: "Sunset Rooftop Lounge & Infinity Pool",
    slug: "sunset-rooftop-lounge",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800",
    location: "Miami, FL",
    capacity: 200,
    pricePerHour: 350,
    rating: 5.0,
    category: "Party",
  },
  {
    id: "4",
    title: "Mid-Century Modern Lounge Room",
    slug: "mid-century-lounge",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    location: "Los Angeles, CA",
    capacity: 30,
    pricePerHour: 80,
    rating: 4.6,
    category: "Birthday",
  }
];

const MOCK_REVIEWS = [
  {
    id: "review-1",
    name: "Sarah Jenkins",
    role: "Bride & Event Planner",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    comment: "Booking the Industrial Glasshouse for our wedding was a dream. The process was completely seamless, and communicating with the host directly through the workspace panel saved us weeks of email overhead.",
    venueName: "Industrial Glasshouse",
  },
  {
    id: "review-2",
    name: "Marcus Chen",
    role: "Creative Director at TechCorp",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    comment: "We rented the Brick Loft for a 3-day design workshop loop. The space was perfectly equipped, capacity limits were accurate, and checking in via the secure app dashboard took less than 2 minutes.",
    venueName: "Minimalist Brick Loft",
  }
];

export default function HomePage() {
  return (
    <div
      className="flex flex-col m-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Venues</h2>
            <p className="font-fraunces font-extralight text-gray-500">
              Hand-picked spaces for your next event.
            </p>
          </div>
          <div>
            <Link href='/venues'
            className="group flex items-center gap-1.5 text-sm font-semibold text-black hover:text-gray-600 transition-colors shrink-0 pb-1">
            <span>View All</span>
          </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 m-10">
          {MOCK_VENUES.map((item) => (
            <VenueCard key={item.id} venue={item} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_REVIEWS.map((review) => (
            <TestimonialCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}