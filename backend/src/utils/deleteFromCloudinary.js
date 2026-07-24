import cloudinary from "../config/cloudinary.js";

const deleteFromCloudinary = async (publicId)=>{
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw error;
     }
}

export default deleteFromCloudinary;