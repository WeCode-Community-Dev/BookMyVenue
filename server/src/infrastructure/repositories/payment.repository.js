import { IPaymentRepository } from "../../domain/repositories/IPayment.repository.js";
import { PaymentModel } from "../database/models/Payment.model.js";
import { PaymentMapper } from "../../application/mapper/Payment.mapper.js";
import { UserModel } from "../database/models/User.model.js";
import VendorModel from "../database/models/Vendor.model.js";
import { BookingModel } from "../database/models/BookingModel.js";
import { Types } from "mongoose";

export class PaymentRepository extends IPaymentRepository {

    async create(payment) {

    const document = await PaymentModel.create(
        PaymentMapper.mapToPersistence(payment)
    );

    return PaymentMapper.mapToEntity(document);

}
async findById(paymentId) {

const payment = await PaymentModel.findById(paymentId)

    .populate(
        "bookingId",
        "bookingDate startTime endTime totalAmount status paymentStatus"
    )

    .populate(
        "userId",
        "fullName email phone"
    )

    .populate(
        "vendorId",
        "fullName companyName email phone"
    );
    if (!payment) return null;

     return PaymentMapper.mapToEntity(payment);

}

async findByBookingId(bookingId) {

    const documents = await PaymentModel.find(bookingId);
    if (!documents) return null;

     return PaymentMapper.mapToEntity(bookingId);

}

async update(paymentId, data) {

    const document = await PaymentModel.findByIdAndUpdate(

        paymentId,

        data,

        {
            new: true
        }

    );
    if (!document) return null

    return PaymentMapper.mapToEntity(document);

}
async getPaymentStatistics() {

    const [

        totalPayments,

        successfulPayments,

        pendingPayments,

        failedPayments,

        refundedPayments

    ] = await Promise.all([

        PaymentModel.countDocuments(),

        PaymentModel.countDocuments({
            paymentStatus: "SUCCESS"
        }),

        PaymentModel.countDocuments({
            paymentStatus: "PENDING"
        }),

        PaymentModel.countDocuments({
            paymentStatus: "FAILED"
        }),

        PaymentModel.countDocuments({
            paymentStatus: "REFUNDED"
        })

    ]);

    const revenue = await PaymentModel.aggregate([

        {
            $match: {
                paymentStatus: "SUCCESS"
            }
        },

        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$amount"
                }
            }
        }

    ]);

    return {

        totalPayments,

        successfulPayments,

        pendingPayments,

        failedPayments,

        refundedPayments,

        totalRevenue:
            revenue.length > 0
                ? revenue[0].totalRevenue
                : 0

    };

}
async findAllFiltered(query = {}) {

    const filter = {};

    if (query.paymentStatus) {
        filter.paymentStatus = query.paymentStatus;
    }

    if (query.paymentMethod) {
        filter.paymentMethod = query.paymentMethod;
    }

    if (query.paymentType) {
        filter.paymentType = query.paymentType;
    }

    if (query.search) {

        const regex = new RegExp(query.search, "i");

        const userIds = await UserModel.find({
            fullName: regex
        }).distinct("_id");

        const vendorIds = await VendorModel.find({
            fullName: regex
        }).distinct("_id");

        const bookingIds = await BookingModel.find().distinct("_id");

        const searchFilter = [

            {
                userId: {
                    $in: userIds
                }
            },

            {
                vendorId: {
                    $in: vendorIds
                }
            }

        ];

        if (Types.ObjectId.isValid(query.search)) {

            searchFilter.push({

                _id: new Types.ObjectId(query.search)

            });

            searchFilter.push({

                bookingId: new Types.ObjectId(query.search)

            });

        }

        filter.$or = searchFilter;

    }

    const totalCount =
        await PaymentModel.countDocuments(filter);

    const totalPages =
        Math.ceil(totalCount / query.limit);

    const documents =
        await PaymentModel.find(filter)

            .populate("bookingId")

            .populate("userId", "fullName email")

            .populate("vendorId", "fullName companyName")

            .sort({
                createdAt:
                    query.sortBy === "asc"
                        ? 1
                        : -1
            })

            .skip((query.page - 1) * query.limit)

            .limit(query.limit);

    return {

        data: documents,

        totalCount,

        totalPages

    };

}

}