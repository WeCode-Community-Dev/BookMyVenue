import {
  createBookingInquiryService,
  getOwnerBookingInquiriesService,
  updateBookingInquiryStatusService,
  checkBookingInquiryStatusService,
  cancelBookingInquiryService
} from "../services/bookingInquiryService.js";

export const createBookingInquiry = async (req, res) => {
  try {
    const bookingInquiry = await createBookingInquiryService({
      ...req.body,
      userId: req.user?._id || null,
    });

    res.status(201).json({
      success: true,
      message: "Booking inquiry submitted successfully",
      data: bookingInquiry,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create booking inquiry",
    });
  }
};

export const getOwnerBookingInquiries = async (req, res) => {
  try {
    const inquiries = await getOwnerBookingInquiriesService(req.user._id);

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch booking inquiries",
    });
  }
};

export const updateBookingInquiryStatus = async (req, res) => {
  try {
    const inquiry = await updateBookingInquiryStatusService({
      inquiryId: req.params.id,
      ownerId: req.user._id,
      status: req.body.status,
    });

    res.status(200).json({
      success: true,
      message: `Booking inquiry ${req.body.status} successfully`,
      data: inquiry,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update booking inquiry",
    });
  }
};

export const checkBookingInquiryStatus = async (req, res) => {
  try {
    const inquiry = await checkBookingInquiryStatusService(req.body);

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to check booking inquiry status",
    });
  }
};

export const cancelBookingInquiry = async (req, res) => {
  try {
    const inquiry = await cancelBookingInquiryService(req.body);

    res.status(200).json({
      success: true,
      message: "Booking inquiry cancelled successfully",
      data: inquiry,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to cancel booking inquiry",
    });
  }
};