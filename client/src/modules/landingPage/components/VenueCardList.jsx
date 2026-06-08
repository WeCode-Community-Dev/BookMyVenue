const VenueCardList = ({
  name,
  location,
  price,
  reviews,
  capacity,
  rating,
  type,
  emoji,
  color,
  accent,
}) => {
  return (
    <div className="venue-card">
      <div
        className="h-[180px] sm:h-[200px] flex items-center justify-center text-[4rem] relative"
        style={{ background: color }}
      >
        {emoji}

        <div
          className="absolute top-3.5 left-3.5 bg-white rounded-lg px-2.5 py-1 text-[0.72rem] font-bold"
          style={{ color: accent }}
        >
          {type}
        </div>

        <div className="absolute top-3.5 right-3.5 bg-white rounded-lg px-2.5 py-1 text-[0.72rem] font-bold text-gray-900">
          ★ {rating}
        </div>
      </div>

      <div className="px-5 pt-5 pb-[22px]">
        <h3 className="text-[1.05rem] font-bold mb-1 tracking-tight">
          {name}
        </h3>

        <p className="text-[0.82rem] text-gray-400 font-medium mb-3.5">
          📍 {location}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {[capacity, `${reviews} reviews`].map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 rounded-lg px-2.5 py-1 text-[0.75rem] font-semibold text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-[1.2rem] font-extrabold tracking-tight">
              {price}
            </span>

            <span className="text-[0.78rem] text-gray-400">
              {" "}
              / day
            </span>
          </div>

          <button className="btn-primary !py-[9px] !px-[18px] !text-[0.82rem] !rounded-[10px]">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCardList;