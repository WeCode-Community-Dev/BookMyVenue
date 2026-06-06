const mongoose = require('mongoose')
const { Schema } = mongoose

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
    amenities:
    {
        type: [String],
        default: []
    },
    image: {
        type: [String],
        default: []
    },
    phone: {
        type: String,
        required: true
    },
    rating: {
        type: Number
    },

    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },

    zipcode: {
        type: String,
        required: true
    },
    location: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number] }
    }

})
venueSchema.index({ location: '2dsphere' });

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue