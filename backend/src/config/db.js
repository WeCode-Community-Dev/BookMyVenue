import mongoose from "mongoose";

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully"); 
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); 
  };
}

export default connection;