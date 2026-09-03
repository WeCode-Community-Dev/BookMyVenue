export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

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

export interface ProfileResponse {
  _id?: string;
  id?: string;
  username?: string;
  name?: string;
  email: string;
  profilePicture?: string;
}
