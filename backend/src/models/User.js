// src/models/User.js
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name:{type:String ,required:true},
    email :{type:String, required:true,unique:true},
    password:{type:String ,required:true},
    role:{
        type:String,
        enum:['user','owner'],
        default:'user'
    }
},{
    timestamps:true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


export default mongoose.model('User',userSchema)