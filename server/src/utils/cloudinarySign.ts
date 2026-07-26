import { v2 as cloudinary } from 'cloudinary';

// The SDK only self-configures from a combined CLOUDINARY_URL env var (it uses the split CLOUDINARY_CLOUD_NAME/API_KEY/ API_SECRET vars instead).
// `cloudinary.utils.api_sign_request` takes the secret as an explicit argument so it worked without this, but any real SDK call — `cloudinary.uploader.destroy`,
// `cloudinary.api.resource`, etc. — needs the SDK actually configured, so do it once here as a side effect of importing this module
// (every module that touches Cloudinary imports it).
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
  folder: string;
}

export function signUploadParams(folder: string): CloudinarySignature | null {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!apiSecret || !cloudName || !apiKey || !uploadPreset) {
    return null;
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { folder, timestamp, upload_preset: uploadPreset };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return { signature, timestamp, cloudName, apiKey, uploadPreset, folder };
}
