/**
 * Cloudinary URL Optimization Utility
 * 
 * Transforms Cloudinary image URLs to serve optimized versions
 * based on the display context (thumbnail, card, full-size).
 * Non-Cloudinary URLs (base64, unsplash, etc.) are returned unchanged.
 */

const CLOUDINARY_UPLOAD_PREFIX = '/upload/';

/**
 * Injects Cloudinary transformation parameters into a URL.
 * Example: .../upload/v123/img.jpg → .../upload/f_auto,q_auto,w_400/v123/img.jpg
 */
function addCloudinaryTransform(url, transforms) {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes(CLOUDINARY_UPLOAD_PREFIX)) {
    return url;
  }

  const insertPoint = url.indexOf(CLOUDINARY_UPLOAD_PREFIX) + CLOUDINARY_UPLOAD_PREFIX.length;
  const before = url.slice(0, insertPoint);
  const after = url.slice(insertPoint);

  return `${before}${transforms}/${after}`;
}

/**
 * Returns a small, fast-loading thumbnail for venue cards (max 400px wide).
 */
export function thumbnailUrl(url) {
  return addCloudinaryTransform(url, 'f_auto,q_auto,w_400,c_fill');
}

/**
 * Returns a medium-quality image for detail page slideshows (max 800px wide).
 */
export function detailUrl(url) {
  return addCloudinaryTransform(url, 'f_auto,q_auto,w_800');
}

/**
 * Returns the full-resolution optimized image.
 */
export function fullUrl(url) {
  return addCloudinaryTransform(url, 'f_auto,q_auto');
}
