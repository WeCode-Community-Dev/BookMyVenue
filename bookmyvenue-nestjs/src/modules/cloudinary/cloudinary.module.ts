import { Module } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}