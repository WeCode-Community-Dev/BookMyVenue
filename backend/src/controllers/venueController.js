import { AppError } from '../handlers/error_handlers.js';
import { sendResponse } from '../handlers/response_handlers.js';
import venueService from '../services/venueServices.js';
import { venueSchema } from '../validations/venueValidation.js';

export default {
  addVenue: async function (req, res) {
    console.log(req.body,"reqBodyyy")
    const payload = venueSchema.parse(req.body);
    const result = await venueService.addVenue({ ...payload, ownerId: req.user.id });
    console.log("result",result)
    sendResponse(res, 201, { message: 'Venue added successfully', data: result });
  },
  getOwnerVenues: async function (req, res) {
    const result = await venueService.getOwnerVenues(req.user.id);
    sendResponse(res, { data: result });
  },

  getVenues: async function (req, res) {
    const payload = { ...req.query };
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin) {
      delete payload.includeInactive;
    }
    const result = await venueService.getVenues(payload, { isAdmin });
    sendResponse(res, {
      data: result.rows,
      meta: { total: result.total, page: result.page, pageSize: result.pageSize },
    });
  },

  updateVenue: async function(req,res){
    const venueId = req.params.id;
    console.log(req.params.id,"req.params.id")
    const payload = req.body;
    const response = await venueService.updateVenue(payload, venueId);
    sendResponse(res,{ 
      data: response,
      message: "venue details updated"
    });
  },

  getVenueDetails: async function (req, res) {
    const venueId = req.params.id;
    const result = await venueService.getVenueDetails(venueId);
    sendResponse(res, { data: result });
  },

  getPendingVenues: async function (req, res) {
    const response = await venueService.getPendingVenues();
    sendResponse(res, { data: response });
  },

  approveVenue: async function (req, res) {
    const venueId = req.params.id;
    const response = await venueService.approveVenue(venueId);
    sendResponse(res, { data: response, message: 'Venue approved' });
  },

  rejectVenue: async function (req, res) {
    const venueId = req.params.id;
    const reason = req.body.reason;
    const response = await venueService.rejectVenue(venueId, reason);
    sendResponse(res, { data: response, message: 'Venue rejected' });
  },

  deactivateVenue: async function (req, res) {
    const venueId = req.params.id;
    const response = await venueService.deactivateVenue(venueId);
    sendResponse(res, { data: response, message: 'Venue deactivated' });
  },

  activateVenue: async function (req, res) {
    const venueId = req.params.id;
    const response = await venueService.activateVenue(venueId);
    sendResponse(res, { data: response, message: 'Venue activated' });
  },

  checkSubmission: async function (req, res) {
    const venueId = req.params.id;
    const response = await venueService.checkSubmission(venueId);
     sendResponse(res, { data: response, message: 'Venue check completed' });
  },

  getAmenities: async function (req,res){
    const response = await venueService.getAmenities();
    sendResponse(res,{data: response});
  }
};
