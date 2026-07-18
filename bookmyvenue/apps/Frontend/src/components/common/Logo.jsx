import { Link } from "react-router-dom";

function Logo({ className = "", to = "/", onClick }) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`cursor-pointer ${className}`}
        aria-label="BookMyVenue home"
      >
        <img
          src="/src/assets/image.png"
          alt="BookMyVenue"
          className="h-10 w-auto object-contain"
        />
      </button>
    );
  }

  return (
    <Link to={to} className={`inline-block ${className}`} aria-label="BookMyVenue home">
      <img
        src="/src/assets/image.png"
        alt="BookMyVenue"
        className="h-10 w-auto object-contain"
      />
    </Link>
  );
}

export default Logo;
