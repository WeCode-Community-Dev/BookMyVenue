const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const MAX_VENUE_IMAGES = 10;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateImageFile(file) {
  if (!file) return "No file selected.";
  if (!ALLOWED_TYPES.includes(file.type))
    return "Only JPG, PNG, WEBP, or GIF files are allowed.";
  if (file.size > MAX_IMAGE_BYTES) return "Each image must be under 5 MB.";
  return null;
}

export function uploadImageToCloudinary(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText).secure_url);
      } else {
        reject(new Error("Cloudinary upload failed."));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during upload.")),
    );

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    );
    xhr.send(formData);
  });
}

/**
 * Uploads files one at a time so progress reflects the whole batch
 * (`done / total` images, plus the current file's own percentage).
 */
export async function uploadImagesToCloudinary(files, onProgress) {
  const urls = [];
  for (let index = 0; index < files.length; index += 1) {
    const url = await uploadImageToCloudinary(files[index], (percent) =>
      onProgress?.({ index, total: files.length, percent }),
    );
    urls.push(url);
  }
  return urls;
}
