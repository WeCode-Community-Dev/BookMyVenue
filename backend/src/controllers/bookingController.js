import { db } from '../db/index.js';
import { bookingsTable } from '../models/bookingModel.js';
import bookingServices from '../services/bookingServices.js';
import { sendResponse } from '../handlers/response_handlers.js';

export default {
  checkAvailability: async function (req, res) {
    const venueId = req.params.id;
    const month = req.query.month;
    const response = await bookingServices.checkAvailability(venueId, month);
    sendResponse(res, { data: response });
  },

  bookVenue: async function (req, res) {
    const { venueId, startDate, endDate, startTime, endTime } = req.body;
    const response = await bookingServices.bookVenue(
      req.user.id,
      venueId,
      startDate,
      endDate,
      startTime,
      endTime
    );
    sendResponse(res, { data: response, statusCode: 201 });
  },

  verifyPayment: async (req, res) => {
    const { bookingId } = req.params;

    const result = await bookingServices.verifyPayment(bookingId);

    sendResponse(res, {
      statusCode: 200,
      message: 'Payment status fetched',
      data: result,
    });
  },

  getUserBookings: async(req,res) => {
    const userId = req.params.userId;
    const result = await bookingServices.getUserBookings(userId);
    sendResponse(res,{
        data: result
    })
  },

  getOwnerBookings: async(req,res) => {
    const ownerId = req.params.ownerId;
    const  result = await bookingServices.getOwnerBookings(ownerId);
    sendResponse(res,{
        data: result
    });
  }
};
