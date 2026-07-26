import { useState } from "react";
import { axiosInstance } from "@/config/axios";
import axios from "axios";
import { API_ENDPOINTS } from "@/constants";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string> => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(
        `Invalid file type: ${file.name}. Only JPG, PNG and WEBP are allowed.`,
      );
    }
    if (file.size > MAX_SIZE) {
      throw new Error(`File too large: ${file.name}. Maximum size is 5MB.`);
    }

    setIsUploading(true);
    try {
      const sigRes = await axiosInstance.get(API_ENDPOINTS.UPLOAD_SIGNATURE);
      const sig = sigRes.data?.data ?? sigRes.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", sig.apiKey);
      formData.append("timestamp", String(sig.timestamp));
      formData.append("signature", sig.signature);
      formData.append("folder", sig.folder);
      formData.append("upload_preset", sig.uploadPreset);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        formData,
      );

      return uploadRes.data.secure_url as string;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
}
