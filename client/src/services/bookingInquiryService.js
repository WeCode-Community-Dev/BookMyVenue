import apiClient from "./apiClient";

export const createBookingInquiry = async (bookingData) => {
  const response = await apiClient.post("/booking-inquiries", bookingData);
  return response.data;
};

export const getOwnerBookingInquiries = async () => {
  const response = await apiClient.get("/booking-inquiries/owner");
  return response.data;
};

export const updateBookingInquiryStatus = async (inquiryId, status) => {
  const response = await apiClient.patch(`/booking-inquiries/${inquiryId}/status`, {
    status,
  });

  return response.data;
};

export const checkBookingInquiryStatus = async (statusData) => {
  const response = await apiClient.post(
    "/booking-inquiries/check-status",
    statusData
  );

  return response.data;
};

export const cancelBookingInquiry = async (cancelData) => {
  const response = await apiClient.patch(
    "/booking-inquiries/cancel",
    cancelData
  );

  return response.data;
};