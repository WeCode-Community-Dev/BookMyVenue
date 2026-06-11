import mongoose from "mongoose";
import UserRole from "../../../domain/enums/userRole.js";
const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        enum: Object.values(UserRole),
        default: UserRole.CUSTOMER
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: null,
        select: false
    }
},
    {
        timestamps:true
    })


export default mongoose.model("User", userSchema)