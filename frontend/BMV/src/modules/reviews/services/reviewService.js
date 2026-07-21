import api from "../../../core/api/client";


export const createReview = ({ venue_id, booking_id, rating, comment }) =>
  api
    .post("/reviews/", { venue_id, booking_id, rating, comment })
    .then((r) => r.data)
    .catch((err) => {
      const message =
        err?.message ||
        err?.response?.data?.detail ||
        "Could not submit review.";
      throw new Error(typeof message === "string" ? message : "Could not submit review.");
    });


export const fetchOwnerReviews = () =>
  api.get("/venue-owners/dashboard/reviews").then((r) => r.data);


export const submitReply = (reviewId, replyText) =>
  api
    .post(`/reviews/${reviewId}/reply`, { reply_text: replyText })
    .then((r) => r.data);