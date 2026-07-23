export default function VenueGallery({ venue }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      {venue.images?.map((image, index) => (
        <img
          key={image.id || `${image.url}-${index}`}
          src={image.url}
          alt={venue.name}
          className="h-72 w-full rounded-2xl object-cover"
        />
      ))}
    </div>
  );
}