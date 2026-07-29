// Helper function to extract Cloudinary public_id from URL
const extractPublicId = (url: string) => {
  const parts = url.split('/');
  const filename = parts.pop()?.split('.')[0];
  const folder = parts.pop();
  const rootFolder = parts.pop();
  return `${rootFolder}/${folder}/${filename}`;
};

export default extractPublicId;
