import { Venue } from "@/types/venue";

export const venues: Venue[] = [
  {
    id: 1,
    name: "Grand Palace Hall",
    location: "Kochi",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    price: 12000,
    capacity: 300,
    rating: 4.8,
    distance: "2.1 km",
    verified: true,
    category: "Banquet Hall",
  },

  {
    id: 2,
    name: "Lake View Resort",
    location: "Alappuzha",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    price: 25000,
    capacity: 200,
    rating: 4.9,
    distance: "5.2 km",
    verified: true,
    category: "Resort",
  },

  {
    id: 3,
    name: "Urban Meetup Space",
    location: "Trivandrum",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    price: 4500,
    capacity: 80,
    rating: 4.6,
    distance: "1.8 km",
    verified: true,
    category: "Meetup",
  },
];