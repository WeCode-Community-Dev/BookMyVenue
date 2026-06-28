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
    profileImage:{
        type:String,
        default:""
    },
    pendingEmail:{
        type:String,
        default:null
    },
    otpCode:{
        type:String,
        deafult:null,
        select:false
    },
    otpExpiresAt:{
        type:Date,
        default:null
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isActive: {
    type: Boolean,
    default: true
    },
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Venue"
    }]
},
    {
        timestamps:true
    })


export default mongoose.model("User", userSchema)