import { BookingRepository } from "../../domain/repositories/IBooking.repository.js";
import mongoose from "mongoose";


import BookingModel from "../database/models/BookingModel.js";

import { BookingMapper } from "../../application/mapper/Booking.mapper.js";

class BookingRepositoryImpl extends BookingRepository {
  async create(entity) {
    const doc = await BookingModel.create(
      BookingMapper.mapToPersistence(entity)
    );

    return BookingMapper.mapToEntity(doc);
  }

  async findById(id) {
    const doc = await BookingModel.findById(id)

      .populate("userId", "fullName email phone")

      .populate("venueId", "name category address");

    return doc;
  }

  async findByUserId(userId) {
    const docs = await BookingModel.find({
      userId,
    });

    return docs.map((doc) => BookingMapper.mapToEntity(doc));
  }

  async findByOwnerId(
    ownerId,
    {
      page = 1,

      limit = 10,

      status,

      search,
    }
  ) {
    const filter = { ownerId };

    if (status) {
      filter.status = status;
    }

    console.log("ownerId:", ownerId);
    console.log("filter:", filter);

    let docs = await BookingModel.find(filter)

      .populate("userId", "fullName email")

      .populate("venueId", "name")

      .sort({
        createdAt: -1,
      });

    if (search) {
      const keyword = search.trim().toLowerCase();

      docs = docs.filter(
        (doc) =>
          doc.userId?.fullName?.toLowerCase().includes(keyword) ||
          doc.venueId?.name?.toLowerCase().includes(keyword) ||
          doc._id.toString().includes(keyword)
      );
    }

    const total = docs.length;

    const skip = (page - 1) * limit;

    docs = docs.slice(skip, skip + Number(limit));

    return {
      bookings: docs.map((doc) => BookingMapper.mapToEntity(doc)),

      pagination: {
        total,

        page: Number(page),

        limit: Number(limit),

        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByVenueAndDate(
    venueId,

    bookingDate
  ) {
    const docs = await BookingModel.find({
      venueId,

      bookingDate,
    });

    return docs.map((doc) => BookingMapper.mapToEntity(doc));
  }

  async update(
    id,

    entity
  ) {
    const doc = await BookingModel.findByIdAndUpdate(
      id,

      BookingMapper.mapToPersistence(entity),

      {
        new: true,
      }
    );

    return BookingMapper.mapToEntity(doc);
  }

  async countByOwnerId(ownerId) {
    return await BookingModel.countDocuments({
      ownerId,
    });
  }

  async countByOwnerIdAndStatus(
    ownerId,

    status
  ) {
    return await BookingModel.countDocuments({
      ownerId,

      status,
    });
  }

  async getTopVenues(ownerId) {
    const result = await BookingModel.aggregate([
      {
        $match: {
          ownerId: new mongoose.Types.ObjectId(ownerId),
        },
      },

      {
        $group: {
          _id: "$venueId",
          bookings: { $sum: 1 },
        },
      },

      {
        $sort: {
          bookings: -1,
        },
      },

      {
        $limit: 5,
      },

      {
        $lookup: {
          from: "venues",
          localField: "_id",
          foreignField: "_id",
          as: "venue",
        },
      },

      {
        $unwind: "$venue",
      },

      {
        $project: {
          _id: 0,
          venueId: "$venue._id",
          name: "$venue.name",
          bookings: 1,
        },
      },
    ]);

    return result;
  }

  async getRecentBookings(ownerId) {
    const docs = await BookingModel.find({
      ownerId,
    })

      .populate("userId", "fullName")

      .populate("venueId", "name")

      .sort({
        createdAt: -1,
      })

      .limit(5);

    return docs.map((doc) => ({
      bookingId: doc._id,

      customer: doc.userId?.fullName,

      venue: doc.venueId?.name,

      amount: doc.totalAmount,

      status: doc.status,

      bookingDate: doc.bookingDate,
    }));
  }
}

export default BookingRepositoryImpl;
