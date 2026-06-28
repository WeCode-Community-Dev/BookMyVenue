import React from "react";
import VenueCard from "./VenueCard";

const venues = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    name: "The Grand Ballroom",
    location: "Connaught Place, New Delhi",
    guests: 500,
    price: "85K",
    bookings: 42,
    rating: 4.8,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865",
    name: "Skyline Terrace",
    location: "Bandra West, Mumbai",
    guests: 250,
    price: "65K",
    bookings: 31,
    rating: 4.7,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d",
    name: "Garden Paradise",
    location: "Whitefield, Bangalore",
    guests: 300,
    price: "50K",
    bookings: 28,
    rating: 4.6,
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
    name: "Royal Banquet Hall",
    location: "Kochi, Kerala",
    guests: 450,
    price: "75K",
    bookings: 39,
    rating: 4.9,
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
    name: "Palm Convention Center",
    location: "Calicut, Kerala",
    guests: 350,
    price: "60K",
    bookings: 22,
    rating: 4.5,
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    name: "Ocean View Resort",
    location: "Goa",
    guests: 400,
    price: "95K",
    bookings: 47,
    rating: 4.9,
  },
];

const VenueGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {venues.map((venue) => (
        <VenueCard
          key={venue.id}
          image={venue.image}
          name={venue.name}
          location={venue.location}
          guests={venue.guests}
          price={venue.price}
          bookings={venue.bookings}
          rating={venue.rating}
        />
      ))}
    </div>
  );
};

export default VenueGrid;