import streamifier from "streamifier";

import cloudinary from "./cloudinary.provider.js";

export const uploadImages = async (files) => {

   const uploads = files.map((file) => {

      return new Promise((resolve, reject) => {

         const stream = cloudinary.uploader.upload_stream(
            {
               folder: "bookmyvenue/venues",
            },
            (error, result) => {

               if (error) {
                  return reject(error);
               }

               resolve(result.secure_url);
            }
         );

         streamifier.createReadStream(file.buffer).pipe(stream);

      });

   });

   return Promise.all(uploads);
};