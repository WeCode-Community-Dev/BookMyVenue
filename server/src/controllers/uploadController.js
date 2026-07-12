import { uploadVenueImagesService } from "../services/uploadService.js";

export const uploadVenueImages = async (req, res) => {
  try {
    const uploadedImages = await uploadVenueImagesService(req.files);

    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      data: uploadedImages,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }
};