import mongoose  from "mongoose";

const connectDB =async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected Succesfully'); 
    } catch (error) {
        console.log('MongoDB connection error',error.message);
        process.exit(1)
    }
}

export default connectDB;