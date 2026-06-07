// app/(venue)/venues/page.tsx

import { TestimonialCard } from "@/src/components/venues/testimonial-card";
import { VenueCard } from "@/src/components/venues/venue-card";

const venues = [
  {
    id: 1,
    name: "Grand Convention Center",
    location: "Kochi",
    capacity: 1000,
  },
  {
    id: 2,
    name: "Royal Banquet Hall",
    location: "Calicut",
    capacity: 500,
  },
  {
    id: 3,
    name: "Green Gardens",
    location: "Malappuram",
    capacity: 300,
  },
];

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
  },
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

export default function VenuesPage() {
  return (
    <div
      className="flex flex-col m-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold">All Venues</h2>
            <p className="font-fraunces font-extralight text-gray-500">
              Hand-picked spaces for your next event.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 m-10">
          {MOCK_VENUES.map((item) => (
            <VenueCard key={item.id} venue={item} />
          ))}
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_REVIEWS.map((review) => (
            <TestimonialCard key={review.id} review={review} />
          ))}
        </div> */}
      </div>
    </div>
  );
}