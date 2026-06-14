import { useState, useEffect } from "react";
import { ROUTES } from "../../../shared/constants/routes";
import { useNavigate } from "react-router-dom";

const typeConfig = {
  AUDITORIUM: { color: "#EDE9FE", accent: "#5B21B6" },
  BANQUET_HALL: { color: "#DBEAFE", accent: "#1D4ED8" },
  CAFE: { color: "#FEF3C7", accent: "#D97706" },
  RESTAURANT: { color: "#FFE4E6", accent: "#BE123C" },
  CONFERENCE_ROOM: { color: "#DCFCE7", accent: "#15803D" },
  STUDIO: { color: "#FCE7F3", accent: "#9D174D" },
  OUTDOOR_SPACE: { color: "#ECFCCB", accent: "#3F6212" },
  OTHER: { color: "#F1F5F9", accent: "#475569" },
};

const VenueCardList = ({
  name,
  city,
  address,
  price,
  currency,
  capacity,
  images,
  type,
  status,
}) => {
  const navigate = useNavigate();

  const { emoji, color, accent } = typeConfig[type] ?? {
    color: "#F3F4F6",
    accent: "#6B7280",
  };

  return (
    <div className="venue-card">
      <div
        className="h-[180px] sm:h-[200px] flex items-center justify-center text-[4rem] relative"
        style={{ background: color }}
      >
        <div className="h-full w-full  relative">
          {images?.length > 0 ? (
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
        </div>

        <div className="absolute top-3.5 left-3.5 bg-white rounded-lg px-2.5 py-1 text-[0.72rem] font-bold">
          {type}
        </div>
      </div>

      <div className="px-5 pt-5 pb-[22px]">
        <h3 className="text-[1.05rem] font-bold mb-1 tracking-tight">{name}</h3>

        <p className="text-[0.82rem] text-gray-400 font-medium mb-3.5">
          📍 {city || address || "Location TBD"}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-[1rem] text-gray-800 font-bold tracking-tight">
              {price ? `${currency ?? "INR"} ${price}` : "Price TBD"}
            </span>
            <span className="text-[0.78rem] text-gray-400"> / day</span>
          </div>

          <button
            disabled={status === "PENDING"}
            onClick={() => navigate(ROUTES.VENUE_BOOKING)}
            className="btn-primary !py-[9px] !px-[18px] !text-[0.82rem] !rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "PENDING" ? "Pending" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCardList;
