import {asyncHandler} from "../../../shared/utils/asyncHandler.js"
import { sendSuccess } from "../../../shared/utils/apiResponse.js"
import { statusCode } from "../../../shared/constants/enums/statusCode.js"
import { ValidationError } from "../../../domain/errors/ValidationError.js";


export class UserProfileController{
    constructor(userGetProfileUsecase,
        userUpdateProfileUsecase,
        requestEmailChangeOtpUsecase,
        verifyEmailChangeOtpUsecase,
        resendEmailChangeOtpUsecase,
        userUpdateProfileImageUsecase,
        userRemoveProfileImageUsecase
    ){
        this._userGetProfileUsecase=userGetProfileUsecase
        this._userUpdateProfileUsecase=userUpdateProfileUsecase
        this._requestEmailChangeOtpUsecase=requestEmailChangeOtpUsecase
        this._verifyEmailChangeOtpUsecase=verifyEmailChangeOtpUsecase
        this._resendEmailChangeOtpUsecase=resendEmailChangeOtpUsecase
        this._userUpdateProfileImageUsecase = userUpdateProfileImageUsecase
        this._userRemoveProfileImageUsecase=userRemoveProfileImageUsecase;

    }

    getProfile=asyncHandler(async(req,res)=>{
        
        const userId=req.user.userId

        const user=await this._userGetProfileUsecase.execute(userId);

        return sendSuccess(res,statusCode.OK,"profile fetched successfully",user)
    })

    updateProfile=asyncHandler(async(req,res)=>{
        const userId=req.user.userId   
        const {fullName,phone}=req.body
        const updatedUser=await this._userUpdateProfileUsecase.execute(
            userId,
            fullName,
            phone
        )

        return sendSuccess(
            res,statusCode.OK,"profile updated successfully",
            updatedUser
        )
    })

    requestEmailChangeOtp=asyncHandler(
        async(req,res)=>{
            const userId=req.user.userId;
            const {newEmail}=req.body
            const result=await this._requestEmailChangeOtpUsecase.execute(userId,newEmail)
            return sendSuccess(res,statusCode.OK,result.message)
        }
    )
    verifyEmailChangeOtp=asyncHandler(async(req,res)=>{
        const userId=req.user.userId
        const {otp}=req.body
        const updatedUser=await this._verifyEmailChangeOtpUsecase.execute(userId,otp)


        return sendSuccess(
            res,
            statusCode.OK,
            "Email updated successfully",
            updatedUser
        )
    })
    resendEmailChangeOtp=asyncHandler(async(req,res)=>{

    const userId=req.user.userId

    const result=await this._resendEmailChangeOtpUsecase.execute(userId)

    return sendSuccess(
        res,
        statusCode.OK,
        result.message
    )
    })
    updateProfileImage = asyncHandler(async(req,res)=>{

        const userId = req.user.userId;

        if(!req.file){
            throw new ValidationError("Please upload a profile image");
        }

        const updatedUser =
            await this._userUpdateProfileImageUsecase.execute(
                userId,
                req.file.path
            );

        return sendSuccess(
            res,
            statusCode.OK,
            "Profile image updated successfully",
            updatedUser
        );
    })
    removeProfileImage=asyncHandler(async(req,res)=>{

        const userId=req.user.userId;

        const updatedUser=
        await this._userRemoveProfileImageUsecase.execute(userId);

        return sendSuccess(
            res,
            statusCode.OK,
            "Profile image removed successfully",
            updatedUser
        );

    });
}