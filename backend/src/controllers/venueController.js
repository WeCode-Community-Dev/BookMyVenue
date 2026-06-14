import { AppError } from '../handlers/error_handlers.js';
import { sendResponse } from '../handlers/response_handlers.js';
import venueService from '../services/venueServices.js';
import { venueSchema } from '../validations/venueValidation.js';

export default {
  addVenue: async function (req, res) {
    const payload = venueSchema.parse(req.body);
    const result = await venueService.addVenue({ ...payload, ownerId: req.user.id });
    sendResponse(res, 201, { message: 'Venue added successfully', data: result });
  },
  getOwnerVenues: async function (req, res) {
    const result = await venueService.getOwnerVenues(req.user.id);
    sendResponse(res, { data: result });
  },

  getVenues: async function (req, res) {
    const payload = req.query;
    const result = await venueService.getVenues(payload);
    sendResponse(res, { data: result.rows, meta: { total: result.total, page: result.page, pageSize: result.pageSize } });
  },

  getVenueDetails: async function(req,res){
    const venueId = req.params.id;
    const result = await venueService.getVenueDetails(venueId);
    sendResponse(res,{data:result});
  }
};
