const STATS = [
  ["10K+", "Venues"],
  ["50K+", "Bookings"],
  ["4.8 ★", "Avg Rating"],
];

const StatsSection = () => {
  return (
    <section className="  py-8">
      <div className="max-w-[1200px] mx-auto flex gap-8 flex-wrap">
        {STATS.map(([n, label]) => (
          <div key={label}>
            <p className="font-bold text-xl">{n}</p>

            <p className="text-gray-400 text-sm">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
