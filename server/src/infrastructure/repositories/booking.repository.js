import { BookingRepository } from "../../domain/repositories/IBooking.repository.js";
import mongoose from "mongoose";
import { BookingModel } from "../database/models/BookingModel.js";
import { UserModel } from "../database/models/User.model.js";
import { VenueModel } from "../database/models/Venue.model.js";
import VendorModel from "../database/models/Vendor.model.js";
import { BookingMapper } from "../../application/mapper/Booking.mapper.js";
import { BookingStatus } from "../../domain/enums/Booking.enum.js";
import { Types } from "mongoose";
import { PaymentStatus } from "../../domain/entities/enums/paymentStatus.js";



export class BookingRepositoryImpl extends BookingRepository {

    async create(entity) {

        const doc = await BookingModel.create(

            BookingMapper.mapToPersistence(entity)

        );
        return BookingMapper.mapToEntity(doc);
    }

    async findById(id) {
        const booking =
            await BookingModel
                .findById(id)
                .populate("userId", "fullName email phone")
                .populate("vendorId", "fullName email phone companyName")
                .populate("venueId");
        if (!booking) return null;
        console.log("Mongo Booking:", booking);
        return BookingMapper.mapToEntity(booking);
    }

    async findByUserId(userId) {
        const docs = await BookingModel.find({
            userId,
        });

        return docs.map((doc) => BookingMapper.mapToEntity(doc));
    }

    async findByOwnerId(
        vendorId,
        {
            page,

            limit,

            status,

            search,
        }
    ) {
        const filter = { vendorId };

        if (status) {
            filter.status = status;
        }

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

    async countByOwnerId(vendorId) {
        return await BookingModel.countDocuments({
            vendorId,
        });
    }

    async countByOwnerIdAndStatus(
        vendorId,

        status
    ) {
        return await BookingModel.countDocuments({
            vendorId,

            status,
        });
    }

    async getTopVenues(vendorId) {
        const result = await BookingModel.aggregate([
            {
                $match: {
                    vendorId: new mongoose.Types.ObjectId(vendorId),
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

    async getRecentBookings(vendorId) {
        const docs = await BookingModel.find({
            vendorId
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


    async findAllFiltered(query) {
        const filter = {};
        if (query.status) { filter.status = query.status; }
        if (query.paymentStatus) { filter.paymentStatus = query.paymentStatus; }
        if (query.search) {
            const regex = new RegExp(query.search, "i");
            const userIds = await UserModel.find({ fullName: regex }).distinct("_id");
            const vendorIds = await VendorModel.find({ $or: [{ fullName: regex }, { companyName: regex }] }).distinct("_id");
            const venueIds = await VenueModel.find({ name: regex }).distinct("_id"); const searchFilter = [{ userId: { $in: userIds } }, { vendorId: { $in: vendorIds } }, { venueId: { $in: venueIds } }];
            if (Types.ObjectId.isValid(query.search)) { searchFilter.push({ _id: new Types.ObjectId(query.search) }); }
            filter.$or = searchFilter;
        }
        const totalCount = await BookingModel.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / query.limit);
        const data = await BookingModel.aggregate([
            { $match: filter }, { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } }, { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "vendors", localField: "vendorId", foreignField: "_id", as: "vendor" } },
            { $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "venues", localField: "venueId", foreignField: "_id", as: "venue" } },
            { $unwind: { path: "$venue", preserveNullAndEmptyArrays: true } },
            { $sort: { bookingDate: query.sortBy === "asc" ? 1 : -1 } },
            { $skip: (query.page - 1) * query.limit }, { $limit: query.limit }]);
        return { data, totalCount, totalPages };
    }
    async getBookingStatistics() {

        const result =
            await BookingModel.aggregate([

                {

                    $group: {

                        _id: null,

                        totalBookings: {
                            $sum: 1
                        },

                        pendingBookings: {

                            $sum: {

                                $cond: [

                                    {
                                        $eq: [
                                            "$status",
                                            BookingStatus.PENDING
                                        ]
                                    },

                                    1,

                                    0

                                ]

                            }

                        },

                        confirmedBookings: {

                            $sum: {

                                $cond: [

                                    {
                                        $eq: [
                                            "$status",
                                            BookingStatus.CONFIRMED
                                        ]
                                    },

                                    1,

                                    0

                                ]

                            }

                        },
                        rejectedBookings: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", BookingStatus.REJECTED] },
                                    1,
                                    0
                                ]
                            }
                        },

                        cancelledBookings: {

                            $sum: {

                                $cond: [

                                    {
                                        $eq: [
                                            "$status",
                                            BookingStatus.CANCELLED
                                        ]
                                    },

                                    1,

                                    0

                                ]

                            }

                        },

                        completedBookings: {

                            $sum: {

                                $cond: [

                                    {
                                        $eq: [
                                            "$status",
                                            BookingStatus.COMPLETED
                                        ]
                                    },

                                    1,

                                    0

                                ]

                            }

                        }

                    }

                }

            ]);

        return result[0] || {

            totalBookings: 0,

            pendingBookings: 0,

            confirmedBookings: 0,
            rejectedBookings: 0,

            cancelledBookings: 0,

            completedBookings: 0

        };

    }
    async hasOverlappingBooking(
        venueId,
            bookingDate,
            startTime,
            endTime
        ) {
        const booking=await BookingModel.findOne({
            venueId,
            bookingDate,
            status:{
                $ne:BookingStatus.CANCELLED
            },
            startTime:{
                $lt:endTime
            },
            endTime:{
                $gt:startTime
            }
        })
        return Boolean(booking)
     }

     async getUserBookings(userId) {

        const bookings = await BookingModel
            .find({ userId })
            .populate("venueId")
            .sort({
                createdAt: -1
            });

        return bookings.map((booking) =>
            BookingMapper.mapToEntity(booking)
        );

    }

    async getUserBookingById(userId, bookingId) {

        const booking = await BookingModel
            .findOne({
                _id: bookingId,
                userId
            })
            .populate("venueId")
            .populate("vendorId", "fullName companyName email phone");

        if (!booking) {
            return null;
        }

        return BookingMapper.mapToEntity(booking);

    }
    async getBookingsForPaymentReminder(date) {

        return await BookingModel.find({
            bookingDate: date,
            status: BookingStatus.CONFIRMED,
            paymentStatus: PaymentStatus.PARTIAL
        });

    }

}

