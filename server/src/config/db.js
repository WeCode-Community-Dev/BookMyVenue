import "dotenv/config";
import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongoDB connected..")
    } catch (error) {
        console.log(`Database connection failed: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;