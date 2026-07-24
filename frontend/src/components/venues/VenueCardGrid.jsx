export const VENUE_CARD_GRID_CLASS =
  "mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-4";

const VenueCardGrid = ({ children, className = "" }) => {
  return (
    <div className={`${VENUE_CARD_GRID_CLASS} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default VenueCardGrid;
