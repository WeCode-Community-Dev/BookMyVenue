import { AdminMapper } from "../../application/mapper/Admin.mapper.js";
import { IAdminRepository } from "../../domain/repositories/IAdmin.repository.js";
import AdminModel from "../database/models/Admin.model.js";
import { UserModel } from "../database/models/User.model.js";
import { VenueModel } from "../database/models/Venue.model.js";
import VendorModel from "../database/models/Vendor.model.js";
import { BookingModel } from "../database/models/BookingModel.js";
import { PaymentModel } from "../database/models/Payment.model.js";
import { PaymentStatus } from "../../domain/enums/Payment.enum.js";
import { VendorApprovalStatus } from "../../domain/enums/VendorApprovalStatus.enum.js";
import { VenueStatus } from "../../domain/enums/Venue.enum.js";


export class AdminRepository extends IAdminRepository {

    async create(admin) {
        const data = AdminMapper.mapToPersistence(admin);

        const document = await AdminModel.create(data);

        return AdminMapper.mapToEntity(document);
    }

    async findById(id) {
        const document = await AdminModel.findById(id);

        if (!document) return null;

        return AdminMapper.mapToEntity(document);
    }

    async findByEmail(email) {
        let document = await AdminModel.findOne({
            email,
            isDeleted: false,
        });

        if (!document) return null;

        return AdminMapper.mapToEntity(document);
    }

    async findAll() {
        const documents = await AdminModel.find({
            isDeleted: false,
        }).sort({ createdAt: -1 });

        return documents.map((doc) =>
            AdminMapper.mapToEntity(doc)
        );
    }

    async update(id, admin) {
        const data = AdminMapper.mapToPersistence(admin);

        const document = await AdminModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );

        if (!document) return null;

        return AdminMapper.mapToEntity(document);
    }

    async softDelete(id) {
        const document = await AdminModel.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
            },
            {
                new: true,
            }
        );

        if (!document) return null;

        return AdminMapper.mapToEntity(document);
    }

    async delete(id) {
        return await AdminModel.findByIdAndDelete(id);
    }

    async updateRefreshToken(adminId, refreshToken) {
        const doc = await AdminModel.findByIdAndUpdate(
            adminId,
            { $push: {refreshToken} },
            { new: true }
        );
        if (!doc) return null;
        return AdminMapper.mapToEntity(doc);
    }

    async clearRefreshToken(token) {
        await AdminModel.findOneAndUpdate(
            {refreshToken: token},
            { $pull: {refreshToken: token } },
            { new: true }
        );
    }
    //Admin dashboard
    async getDashboardStatistics() {

    const [

      totalUsers,

      totalVendors,

      pendingVendorApprovals,

      totalVenues,

      pendingVenueApprovals,

      totalBookings,

    ] = await Promise.all([

      UserModel.countDocuments(),

      VendorModel.countDocuments(),

      VendorModel.countDocuments({
        approvalStatus: VendorApprovalStatus.PENDING,
      }),

      VenueModel.countDocuments(),

      VenueModel.countDocuments({
        approvalStatus: VenueStatus.PENDING,
      }),

      BookingModel.countDocuments(),

    ]);

    const revenue = await PaymentModel.aggregate([

      {
        $match: {
          paymentStatus: PaymentStatus.SUCCESS,
        },
      },

      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },

    ]);

    const bookingOverview = await BookingModel.aggregate([
  {
    $group: {
      _id: {
        month: {  $month: {
          $toDate: "$createdAt"
        } },
      },
      bookings: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      "_id.month": 1,
    },
  },
]);
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formattedBookingOverview = bookingOverview.map((item) => ({
  month: months[item._id.month - 1],
  bookings: item.bookings,
}));

const revenueOverview = await PaymentModel.aggregate([
  {
    $match: {
      paymentStatus: PaymentStatus.SUCCESS,
    },
  },
  {
  $group: {
    _id: {
      month: {
        $month: {
          $toDate: "$createdAt"
        }
      }
    },
    revenue: {
      $sum: "$amount"
    }
  }
},
  {
    $sort: {
      "_id.month": 1,
    },
  },
]);

const formattedRevenueOverview = revenueOverview.map((item) => ({
  month: months[item._id.month - 1],
  revenue: item.revenue,
}));

    return {

      summary: {

        totalUsers,

        totalVendors,

        pendingVendorApprovals,

        totalVenues,

        pendingVenueApprovals,

        totalBookings,

        totalRevenue:
          revenue.length > 0
            ? revenue[0].totalRevenue
            : 0,

      },
       "bookingOverview": formattedBookingOverview,
  "revenueOverview": formattedRevenueOverview,

    };

  }



}