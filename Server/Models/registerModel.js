import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    mail:{
        type: String,
        require: true
    },
    number: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ["user", "organizer", "admin"],
        default: "user"
    }
})

const userModel = mongoose.model("user", userSchema)