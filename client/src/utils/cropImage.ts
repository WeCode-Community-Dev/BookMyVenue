import { MAX_AVATAR_FILE_SIZE } from '@/constants/upload';

const MAX_OUTPUT_BYTES = MAX_AVATAR_FILE_SIZE;
const QUALITY_STEPS = [0.92, 0.8, 0.6];

interface CropPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image for cropping'));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
}

export async function getCroppedImageBlob(
  imageSrc: string,
  cropPixels: CropPixels,
  outputSize = 512
): Promise<Blob> {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas is not supported in this browser');
  }

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    outputSize,
    outputSize
  );

  for (const quality of QUALITY_STEPS) {
    const blob = await canvasToBlob(canvas, quality);
    if (blob && blob.size <= MAX_OUTPUT_BYTES) {
      return blob;
    }
  }

  throw new Error('Could not compress the cropped image small enough to upload');
}
