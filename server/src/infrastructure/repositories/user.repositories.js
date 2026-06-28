import UserModel from "../database/models/UserModel.js";

import { IUserRepository } from "../../domain/repositories/IUser.repository.js";

export class UserRepository extends IUserRepository{
    async findById(id){
        return await UserModel.findById(id)
    }

    async update(id,data){
        return await UserModel.findByIdAndUpdate(
            id,
            {$set:data},
            {new:true}
        )
    }
    async findByEmail(email){
        return await UserModel.findOne({email})
    }

    async saveEmailChangeOtp(userId,pendingEmail,otpCode,otpExpiresAt){
        return await UserModel.findByIdAndUpdate(userId,{
            pendingEmail,
            otpCode,
            otpExpiresAt
        },
        {
            new:true
        })
    }
    async updateEmailAfterVerification(userId){
        const user=await UserModel.findById(userId)

         return await UserModel.findByIdAndUpdate(userId,{
            email:user.pendingEmail,
            pendingEmail:null,
            otpCode:null,
            otpExpiresAt:null
    },{
        new:true
    })
    }

    async findByIdWithOtp(userId){
        return await UserModel.findById(userId).select("+otpCode")
    }

    // async clearEmailChnageOtp(userId){
    //     return await UserModel.findByIdAndUpdate(
    //         userId,{
    //             pendingEmail:null,
    //             otpCode:null,
    //             otpExpiresAt:null
    //         },
    //         {
    //             new:true
    //         }
    //     )
    // }


    async addToWishlist(userId, venueId) {

    const user = await UserModel.findById(userId);

    if (!user) {
        return null;
    }

    const alreadyExists = user.wishlist.some(
        id => id.toString() === venueId
    );

    if (alreadyExists) {
        return {
            alreadyExists: true
        };
    }

    user.wishlist.push(venueId);

    await user.save();

    return user;
}

async removeFromWishlist(userId, venueId) {

    const user = await UserModel.findById(userId);

    if (!user) {
        return null;
    }

    const exists = user.wishlist.some(
        id => id.toString() === venueId
    );

    if (!exists) {
        return {
            notFound: true
        };
    }

    user.wishlist.pull(venueId);

    await user.save();

    return user;
}

async getWishlist(userId) {

    return await UserModel.findById(userId)
        .populate("wishlist");
}

async updateAccountStatus(userId, isActive){

    return await UserModel.findByIdAndUpdate(
        userId,
        {
            isActive
        },
        {
            new: true
        }
    );
}
async updateProfileImage(userId, profileImage){

    return await UserModel.findByIdAndUpdate(
        userId,
        {
            profileImage
        },
        {
            new: true
        }
    );
}

async removeProfileImage(userId){

    return await UserModel.findByIdAndUpdate(
        userId,
        {
            profileImage: ""
        },
        {
            new: true
        }
    );
}

}
