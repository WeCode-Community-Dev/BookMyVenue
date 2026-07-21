import api from "../../../core/api/client";


export const fetchOwnerReviews = () =>
  api.get("/venue-owners/dashboard/reviews").then((r) => r.data);


export const submitReply = (reviewId, replyText) =>
  api
    .post(`/reviews/${reviewId}/reply`, { reply_text: replyText })
    .then((r) => r.data);