import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { sendSuccess } from "../../../shared/utils/apiResponse.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";
import { UserMessage } from "../../../shared/constants/messages/userMessages.js";

export class UserWishlistController {

    constructor(
        userAddToWishlistUsecase,
        userGetWishlistUsecase,
          userRemoveWishlistUsecase
    ){
        this._userAddToWishlistUsecase = userAddToWishlistUsecase;
        this._userGetWishlistUsecase = userGetWishlistUsecase;
         this._userRemoveWishlistUsecase = userRemoveWishlistUsecase;
    }
    addToWishlist = asyncHandler(async(req,res)=>{

        const userId = req.user.userId;

        const { venueId } = req.params;

        const wishlist = await this._userAddToWishlistUsecase.execute(
            userId,
            venueId
        );

        return sendSuccess(
            res,
            statusCode.OK,
            UserMessage.success.WISHLIST_ADDED,
            wishlist
        );
    });
    getWishlist = asyncHandler(async(req,res)=>{

        const userId = req.user.userId;

        const wishlist = await this._userGetWishlistUsecase.execute(
            userId
        );

        return sendSuccess(
            res,
            statusCode.OK,
            UserMessage.success.WISHLIST_FETCHED,
            wishlist
        );
    });
    removeWishlist = asyncHandler(async(req,res)=>{

        const userId = req.user.userId;

        const { venueId } = req.params;

        const wishlist = await this._userRemoveWishlistUsecase.execute(
            userId,
            venueId
        );

        return sendSuccess(
            res,
            statusCode.OK,
            UserMessage.success.WISHLIST_REMOVED,
            wishlist
        );
    });

}