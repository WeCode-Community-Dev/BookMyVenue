export default function VenueAbout({ description }) {
  return (
    <section className="bg-white rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">
        About this venue
      </h2>

      <p className="text-gray-600 leading-7">
        {description}
      </p>
    </section>
  );
}