import Link from "next/link";
import { MapPin, Users, Star } from "lucide-react";

interface VenueCardProps {
  venue: {
    id: string;
    title: string;
    slug: string;
    imageUrl: string;
    location: string;
    capacity: number;
    pricePerHour: number;
    rating: number;
    category: string;
  };
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link 
      href={`/venue/${venue.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300"
    >
      <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
        <img
          src={venue.imageUrl}
          alt={venue.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
          {venue.category}
        </span>
      </div>

      <div className="p-5">
        
        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-gray-500 mb-2">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{venue.location}</span>
          </div>
          <div className="flex items-center gap-1 text-black shrink-0">
            <Star className="h-3.5 w-3.5 fill-black text-black" />
            <span>{venue.rating.toFixed(1)}</span>
          </div>
        </div>

        <h4 className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-gray-700 transition-colors line-clamp-1">
          {venue.title}
        </h4>
        <div className="my-4 border-t border-gray-50" />

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Users className="h-4 w-4 text-gray-400" />
            <span>Up to {venue.capacity} guests</span>
          </div>
          
          <div className="text-right">
            <span className="text-lg font-extrabold text-black">${venue.pricePerHour}</span>
            <span className="text-xs text-gray-500 font-medium"> / hr</span>
          </div>
        </div>

      </div>
    </Link>
  );
}