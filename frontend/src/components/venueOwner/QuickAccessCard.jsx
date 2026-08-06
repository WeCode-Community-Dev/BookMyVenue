export default function QuickAccessCard({
  icon: Icon,
  title,
  iconColor,
  bgColor,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full rounded-xl p-4 
        flex gap-1
        transition-all duration-200
        hover:-translate-y-1 hover:shadow-md
        ${bgColor}
      `}
    >
      <Icon size={24} className={iconColor} />

      <h3 className={`font-semibold ${iconColor}`}>
        {title}
      </h3>
    </button>
  );
}