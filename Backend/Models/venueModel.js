const mongoose = require('mongoose')
const {Schema} = mongoose

const venueSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    type: {
        type: String,
        //require: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        //required: true
    },
    price: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    amenities: [String],
    Images: [String],
    phone: {
        type: String,
        required: true
    },
    rating: {
        type: Number
    },
    location: {
        city: String,
        district: String,
        state: String,
        pincode: String,
        coordinates: {
            lat: Number,
            long: Number
        },

    }
})

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue