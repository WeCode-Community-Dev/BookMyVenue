import Image from "next/image";
import {
  MapPin,
  Users,
  CalendarDays,
  MoreVertical,
} from "lucide-react";

interface VenueCardProps {
  image: string;
  name: string;
  location: string;
  guests: number;
  price: number;
  status: "Active" | "Inactive";
}

export default function VenueCard({
  image,
  name,
  location,
  guests,
  price,
  status,
}: VenueCardProps) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-sm">
      <div className="relative h-44 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />

        <span className="absolute right-3 top-3 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          {status}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-semibold">{name}</h3>

          <button>
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={14} />
          {location}
        </div>

        <div className="mb-5 flex items-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Users size={16} />
            {guests} Guests
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            ₹{price.toLocaleString()} / day
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 text-[12px] rounded-lg border border-teal-600 py-2 font-medium text-teal-600">
            Edit
          </button>

          <button className="flex-1 text-[12px] rounded-lg bg-teal-600 py-2 font-medium text-white">
            View Bookings
          </button>
        </div>
      </div>
    </div>
  );
}