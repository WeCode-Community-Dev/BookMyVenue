export default function VenueGallery({ venue }) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {venue.images?.map((image, index) => (
        <img
          key={index}
          src={image.url}
          alt={venue.name}
          className="w-full h-72 object-cover rounded-2xl"
        />
      ))}
    </div>
  );
}