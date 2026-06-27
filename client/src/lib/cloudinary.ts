const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(UPLOAD_URL, { method: "POST", body: formData });

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
};

export const uploadImages = async (files: File[]): Promise<string[]> => {
  return Promise.all(files.map((file) => uploadImage(file)));
};
