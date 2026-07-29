import cloudinary from "../config/cloudinary.config.js";
import { ICloudinaryService } from '../../application/services/cloudinaryService.js'


export class CloudinaryService extends ICloudinaryService {
    async deleteImage(publicId){
        return await cloudinary.uploader.destroy(publicId)
    }

    async deleteImages(publicIdS){
        for(let publicId of publicIdS){
            await cloudinary.uploader.destroy(publicId)
        }
    }
}