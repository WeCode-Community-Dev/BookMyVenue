import { useState } from 'react';
import { useToast } from './useToast';
import { getAvatarUploadSignature } from '@/services/userService';
import axios from 'axios';
import { ALLOWED_IMAGE_TYPES, MAX_AVATAR_FILE_SIZE } from '@/constants/upload';

export const useAvatarUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { error: showError } = useToast();

  const validateFile = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showError(`Invalid file type: ${file.name}. Only JPG, PNG and WEBP are allowed.`);
      return false;
    }
    if (file.size > MAX_AVATAR_FILE_SIZE) {
      showError(`File too large: ${file.name}. Maximum size is 2MB.`);
      return false;
    }
    return true;
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!validateFile(file)) {
      throw new Error('File validation failed');
    }

    setIsUploading(true);
    try {
      const sig = await getAvatarUploadSignature();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sig.apiKey);
      formData.append('timestamp', String(sig.timestamp));
      formData.append('signature', sig.signature);
      formData.append('folder', sig.folder);
      formData.append('upload_preset', sig.uploadPreset);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        formData
      );

      return res.data.public_id as string;
    } catch (error) {
      showError('Failed to upload profile picture. Please try again.');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadAvatar, isUploading };
};
