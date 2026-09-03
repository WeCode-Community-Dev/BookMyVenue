import { axiosInstance } from '@/config/axios';
import { API_ENDPOINTS } from '@/constants';

export interface UpdateProfileDto {
  username?: string;
  profilePicturePublicId?: string;
}

export interface CloudinarySignatureResponse {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
  folder: string;
}

export interface UpdatedProfile {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export async function updateProfile(dto: UpdateProfileDto): Promise<UpdatedProfile> {
  const res = await axiosInstance.patch(API_ENDPOINTS.PROFILE, dto);
  return res.data?.data ?? res.data;
}

export async function getAvatarUploadSignature(): Promise<CloudinarySignatureResponse> {
  const res = await axiosInstance.get(API_ENDPOINTS.PROFILE_UPLOAD_SIGNATURE);
  return res.data?.data ?? res.data;
}

export async function deleteProfilePicture(): Promise<UpdatedProfile> {
  const res = await axiosInstance.delete(API_ENDPOINTS.PROFILE_PICTURE);
  return res.data?.data ?? res.data;
}
