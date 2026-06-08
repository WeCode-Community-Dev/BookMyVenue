import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const createdBooking = new this.bookingModel(createBookingDto);
    return createdBooking.save();
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().populate('venueId').populate('userId').exec();
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingModel.find({ userId }).populate('venueId').exec();
  }

  async findByVenue(venueId: string): Promise<Booking[]> {
    return this.bookingModel.find({ venueId }).populate('userId').exec();
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookingModel.findById(id).populate('venueId').populate('userId').exec();
  }

  async updateStatus(id: string, status: string): Promise<Booking | null> {
    return this.bookingModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
  }
}
