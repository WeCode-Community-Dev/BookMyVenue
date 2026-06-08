import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Venue, VenueDocument } from './schemas/venue.schema';
import { CreateVenueDto } from './dto/create-venue.dto';

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class VenuesService {
  
  constructor(
    @InjectModel(Venue.name) private readonly venueModel: Model<VenueDocument>,
  ) {}

  // async onModuleInit() {
  //   try {
  //     const count = await this.venueModel.countDocuments().exec();
  //     // if (count === 0) {
  //     //   console.log('Seeding default venues in MongoDB...');
  //     //   // await this.venueModel.insertMany(this.defaultVenues);
  //     //   console.log('Seeding finished successfully.');
  //     // }
  //   } catch (err) {
  //     console.error('Failed to seed venues:', err);
  //   }
  // }

  async create(createVenueDto: CreateVenueDto, ownerId: string): Promise<Venue> {
    const savedImages: string[] = [];
    if (createVenueDto.images && createVenueDto.images.length > 0) {
      for (const imageStr of createVenueDto.images) {
        if (imageStr.startsWith('data:image/')) {
          const matches = imageStr.match(/^data:image\/([A-Za-z0-9\-+]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const ext = matches[1];
            const data = matches[2];
            const buffer = Buffer.from(data, 'base64');
            const filename = `${crypto.randomUUID()}.${ext}`;
            const filepath = path.join(process.cwd(), 'uploads', filename);
            fs.writeFileSync(filepath, buffer);
            savedImages.push(`/uploads/${filename}`);
          } else {
            savedImages.push(imageStr);
          }
         
        // else if (imageStr.startsWith('http://') || imageStr.startsWith('https://') || imageStr.startsWith('/')) {
        //   savedImages.push(imageStr);
        } else {
          try {
            const buffer = Buffer.from(imageStr, 'base64');
            const filename = `${crypto.randomUUID()}.png`;
            const filepath = path.join(process.cwd(), 'uploads', filename);
            fs.writeFileSync(filepath, buffer);
            savedImages.push(`/uploads/${filename}`);
          } catch (e) {
            savedImages.push(imageStr);
          }
        }
      }
    }

    const createdVenue = new this.venueModel({
      ...createVenueDto,
      images: savedImages,
      ownerId,
    });
    return createdVenue.save();
  }

  async findAll(search?: string): Promise<Venue[]> {
    if (search) {
      const regex = new RegExp(search, 'i');
      return this.venueModel
        .find({
          $or: [
            { name: regex },
            { location: regex },
            { type: regex },
          ],
        })
        .exec();
    }
    return this.venueModel.find().exec();
  }

  async findById(id: string): Promise<Venue | null> {
    // Allows querying both by custom virtual id hex string (Mongoose _id)
    return this.venueModel.findById(id).exec();
  }

  async findByOwnerId(ownerId: any): Promise<Venue[]> {
    return this.venueModel.find({ ownerId }).exec();
  }
}
