import api from "../../../core/api/client";


export const fetchOwnerReviews = () =>
  api.get("/venue-owners/dashboard/reviews").then((r) => r.data);


export const submitReply = (reviewId, replyText) =>
  api
    .post(`/reviews/${reviewId}/reply`, { reply_text: replyText })
    .then((r) => r.data);


export const reviewService = {
  /**
   * Public endpoint — recent high-rated reviews from approved venues.
   * No auth required. Used on landing page testimonials.
   */
  fetchPublicReviews: async (limit = 6) => {
    const { data } = await client.get("/reviews/public", { params: { limit } });
    return data;
  },
};