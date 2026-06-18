import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (fileBuffer)=>{
    return new Promise((resolve, reject)=>{
        cloudinary.uploader.upload_stream({folder: 'bookmyvenue'}, (error, result)=>{
            if(error){
                reject(error);
            }else{
                resolve(result);
            }
        }).end(fileBuffer);
    });
}

export default uploadToCloudinary;