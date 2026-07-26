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
  Eye,
} from "lucide-react";

const VenueCard = ({
  image,
  name,
  location,
  guests,
  price,
  bookings,
  rating,
  category,
  status,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg">

      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="h-60 w-full object-cover"
        />

        {/* Category */}
        <span className="absolute left-3 top-3 rounded-lg bg-white px-2.5 py-1 text-xs font-medium shadow-sm">
          {category || "Venue"}
        </span>

        {/* Status */}
        <span className="absolute right-3 top-3 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
          ● {status || "Active"}
        </span>

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-black/50 px-2 py-1 text-sm font-medium text-white backdrop-blur-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {rating}
        </div>
      </div>

      <CardContent className="p-5">

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-slate-900">
          {name}
        </h3>

        {/* Location */}
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2 border-b border-slate-200 pb-4 text-sm">

          <div className="flex items-center gap-1 text-slate-600">
            <Users className="h-4 w-4" />
            <span>{guests}</span>
          </div>

          <div className="text-center font-medium text-slate-600">
            ₹{price}/day
          </div>

          <div className="flex items-center justify-end gap-1 text-slate-600">
            <Calendar className="h-4 w-4" />
            <span>{bookings}</span>
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-2">

          {/* View Details */}
          <Button
            variant="secondary"
            className="flex-1 rounded-xl"
            onClick={onView}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>

          {/* Edit */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          {/* Delete */}
          <Button
            variant="destructive"
            size="icon"
            className="rounded-xl"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

        </div>

      </CardContent>
    </Card>
  );
};

export default VenueCard;