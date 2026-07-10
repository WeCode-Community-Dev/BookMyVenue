import cloudinary from '@/configs/cloudinary.config';

export const uploadToCloudinary = async (filePath: string, folder = 'bmv') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    throw new Error('Cloudinary upload failed');
  }
};
export const deleteFromCloudinary = async (publicId: string | undefined | null) => {
  try {
    if (!publicId) return;
    return await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    throw new Error('Cloudinary deletion failed');
  }
};
