import cloudinary from "../Config/cloudinaryConfig.js";

export const uploadCloudinary = async (filePath) => {
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      folder: "BookMyVenue",
    });

    return response.secure_url;
  } catch (error) {
    console.log("upload error", error);
    throw error;
  }
};

