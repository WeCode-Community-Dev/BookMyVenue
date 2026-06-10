import { AppError } from '../handlers/error_handlers.js';
import { sendResponse } from '../handlers/response_handlers.js';
import venueService from '../services/venueServices.js';
import {venueSchema} from '../validations/venueValidation.js';


export default {
addVenue : async function(req,res){
    const payload = venueSchema.parse(req.body);
    console.log(req.body,"payload")
    const result = await venueService.addVenue({...payload, ownerId: req.user.id});
    sendResponse(res, 201, { message: 'Venue added successfully', data: result });
}  

 }
