import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

const uploadBufferToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "bookmyvenue/venue-images",
        resource_type: "image",
        transformation: [
          {
            width: 1200,
            height: 800,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const uploadVenueImagesService = async (files = []) => {
  if (!files.length) {
    const error = new Error("Please upload at least one image");
    error.statusCode = 400;
    throw error;
  }

  const uploadedImages = await Promise.all(
    files.map((file) =>
      uploadBufferToCloudinary(file.buffer, "bookmyvenue/venue-images")
    )
  );

  return uploadedImages;
};