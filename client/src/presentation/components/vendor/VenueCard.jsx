import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  Calendar,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";

const VenueCard = ({
  image,
  name,
  location,
  guests,
  price,
  bookings,
  rating,
}) => {
  return (
    <Card className="overflow-hidden rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300">

      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-60 object-cover"
        />

        {/* Category */}
        <span className="absolute top-3 left-3 bg-white px-2.5 py-1 rounded-lg text-xs font-medium shadow-sm">
          Banquet Hall
        </span>

        {/* Status */}
        <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
          ● Active
        </span>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-sm font-medium">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          {rating}
        </div>
      </div>

      <CardContent className="p-5">

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-5">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-4 mb-4 text-sm">

          <div className="flex items-center gap-1 text-slate-600">
            <Users className="w-4 h-4" />
            <span>{guests}</span>
          </div>

          <div className="text-center text-slate-600 font-medium">
            ₹{price}/day
          </div>

          <div className="flex items-center justify-end gap-1 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{bookings}</span>
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-3">

          <Button
            variant="outline"
            className="flex-1 rounded-xl"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="rounded-xl"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

        </div>

      </CardContent>
    </Card>
  );
};

export default VenueCard;