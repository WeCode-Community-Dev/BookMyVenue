import { sendResponse } from "../handlers/response_handlers.js";
import favoriteServices from "../services/favouriteServices.js"



export default {
    addFavorite: async function(req,res){
        const userId = req.user.id;
        const venueId = req.params.venueId;
        const response = await favoriteServices.addFavorite(userId,venueId);
        sendResponse(res,{data: response, statusCode:201})

    },

    deleteFavorite:  async function (req,res){
        const venueId = req.params.venueId;
        const userId = req.user.id;
        await favoriteServices.deleteFavorite(venueId,userId);
        sendResponse(res,{statusCode: 204})
    },

    getFavorites: async function (req,res){
        const userId = req.user.id;
        const result = await favoriteServices.getFavorites(userId);
        sendResponse(res,{data: result})
    }

}