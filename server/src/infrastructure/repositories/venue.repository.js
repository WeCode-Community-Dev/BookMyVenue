import { VenueMapper } from "../../application/mapper/Venue.mapper.js";
import { IVenueRepository } from "../../domain/repositories/IVenue.repository.js";
import { VenueModel } from "../database/Venue.model.js";
import { VenueStatus } from "../../domain/enums/Venue.enum.js";

export class VenueRepository extends IVenueRepository {
    async findById(id) {
        const document = await VenueModel.findById(id)

        if (!document) return null
        return VenueMapper.mapToEntity(document)
    }

    async create(venue) {
        const data = VenueMapper.mapToPersistence(venue)
        const document = await VenueModel.create(data)
        return VenueMapper.mapToEntity(document)
    }

    async update(id, venue) {
        const data = VenueMapper.mapToPersistence(venue)
        const document = await VenueModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        )
        if (!document) return null
        return VenueMapper.mapToEntity(document)
    }

    async findByOwnerAndName(vendorId, name) {
        const document = await VenueModel.findOne({
            vendorId,
            name
        })
        if (!document) return null
        return VenueMapper.mapToEntity(document)
    }

    async findAllFiltered(query = {}) {

        const filter = {
            isDeleted: false
        };

        // Vendor - only own venues
        if (query.vendorId) {
            filter.vendorId = query.vendorId;
        }

        // User/Admin - approval status
        if (query.approvalStatus) {
            filter.approvalStatus = query.approvalStatus;
        }

        // Venue status (AVAILABLE, UNAVAILABLE, etc.)
        if (query.status) {
            filter.status = query.status;
        }

        // Blocked / Unblocked
        if (query.isBlocked !== undefined) {
            filter.isBlocked = query.isBlocked === "true";
        }

        // Category
        if (query.category) {
            filter.category = query.category;
        }

        // Price filter
        if (query.price) {
            filter.$or = [
                { pricePerHour: { $lte: query.price } },
                { pricePerDay: { $lte: query.price } }
            ];
        }

        // Min / Max price
        if (query.minPrice || query.maxPrice) {

            filter.pricePerDay = {};

            if (query.minPrice) {
                filter.pricePerDay.$gte = query.minPrice;
            }

            if (query.maxPrice) {
                filter.pricePerDay.$lte = query.maxPrice;
            }
        }

        // Rating
        if (query.rating) {
            filter.rating = query.rating;
        }

        // Amenities
        if (query.amenities) {
            filter.amenities = {
                $all: query.amenities
            };
        }

        // Search
        if (query.search) {

            filter.$or = [

                {
                    name: {
                        $regex: query.search,
                        $options: "i"
                    }
                },

                {
                    "address.addressLine1": {
                        $regex: query.search,
                        $options: "i"
                    }
                },

                {
                    "address.city": {
                        $regex: query.search,
                        $options: "i"
                    }
                },

                {
                    "address.state": {
                        $regex: query.search,
                        $options: "i"
                    }
                }

            ];

        }

        const skip = query.limit * (query.page - 1);

        const totalCount =
            await VenueModel.countDocuments(filter);

        const totalPages =
            Math.ceil(totalCount / query.limit);

        const documents =
            await VenueModel.find(filter)
                .populate(
                    "vendorId",
                    "fullName email phone"
                )
                .sort({
                    createdAt: -1
                })
                .skip(skip)
                .limit(query.limit);

        return {

            data: documents,

            totalCount,

            totalPages

        };

    }

    async approveVenue(id) {

        const venue =
            await VenueModel.findByIdAndUpdate(

                id,

                {

                    approvalStatus: VenueStatus.ACTIVE,

                    rejectionReason: null

                },

                {

                    new: true

                }

            ).populate(
                "vendorId",
                "fullName email"
            );

        if (!venue) return null;

        return VenueMapper.mapToEntity(venue);

    }

    async rejectVenue(id, reason) {

        const venue =
            await VenueModel.findByIdAndUpdate(

                id,

                {

                    approvalStatus: VenueStatus.REJECTED,

                    rejectionReason: reason

                },

                {

                    new: true

                }

            ).populate(
                "vendorId",
                "fullName email"
            );

        if (!venue) return null;

        return VenueMapper.mapToEntity(venue);

    }

    async updateBlockStatus(
        id,
        isBlocked
    ) {

        const venue =
            await VenueModel.findByIdAndUpdate(

                id,

                {
                    isBlocked
                },

                {

                    new: true

                }

            );

        if (!venue) return null;

        return VenueMapper.mapToEntity(venue);

    }

    async delete(id) {
        return await VenueModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        )
    }
    // mapToEntity(doc){
    //     return VenueMapper.mapToEntity(doc)
    // }

  async delete(id) {
    return await VenueModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
  // mapToEntity(doc){
  //     return VenueMapper.mapToEntity(doc)
  // }

  // mapToPersistence(entity){
  //     return VenueMapper.mapToPersistence(entity)
  // }

  async countByOwnerId(ownerId) {
    return await VenueModel.countDocuments({
      ownerId,

      isDeleted: false,
    });
  }
}
