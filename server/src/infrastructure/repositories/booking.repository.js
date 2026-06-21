import { BookingRepository } from "../../domain/repositories/IBooking.repository.js";

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

        console.log("id :", id);
        const doc = await BookingModel.findById(id);
        console.log("doc :", doc);

        return BookingMapper.mapToEntity(doc);

    }


    async findByUserId(userId) {

        const docs = await BookingModel.find({

            userId

        });

        return docs.map(doc =>

            BookingMapper.mapToEntity(doc)

        );

    }


    async findByOwnerId(ownerId) {

        const docs = await BookingModel.find({

            ownerId

        });

        return docs.map(doc =>

            BookingMapper.mapToEntity(doc)

        );

    }


    async findByVenueAndDate(

        venueId,

        bookingDate

    ) {

        const docs = await BookingModel.find({

            venueId,

            bookingDate

        });

        return docs.map(doc =>

            BookingMapper.mapToEntity(doc)

        );

    }


    async update(

        id,

        entity

    ) {

        const doc =

            await BookingModel.findByIdAndUpdate(

                id,

                BookingMapper.mapToPersistence(entity),

                {

                    new: true

                }

            );

        return BookingMapper.mapToEntity(doc);

    }

}


export default BookingRepositoryImpl;