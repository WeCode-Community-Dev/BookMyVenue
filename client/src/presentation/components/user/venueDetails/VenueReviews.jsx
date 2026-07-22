export default function VenueReviews({
  rating = 0,
  reviews = [],
}) {
  return (
    <section className="bg-white rounded-2xl p-6 mt-6 border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Guest Reviews
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-xl">
            ★
          </span>

          <span className="font-semibold">
            {rating || "0.0"}
          </span>

          <span className="text-gray-500">
            ({reviews.length} reviews)
          </span>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No reviews yet.
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {reviews.slice(0, 3).map((review, index) => (
            <div
              key={review._id || index}
              className="border-b pb-5 last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {review.user?.fullName || "Anonymous User"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {review.createdAt
                      ? new Date(
                          review.createdAt
                        ).toLocaleDateString()
                      : ""}
                  </p>
                </div>

                <span className="text-yellow-500">
                  ★ {review.rating}
                </span>
              </div>

              <p className="text-gray-600 mt-3">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* View all */}
      {reviews.length > 3 && (
        <button
          type="button"
          className="mt-5 border border-gray-300 rounded-xl px-5 py-2 font-medium hover:bg-gray-50"
        >
          View All Reviews
        </button>
      )}
    </section>
  );
}