const asyncHandler = require('express-async-handler');
const StatusCode = require('../statusCode');
const Venue = require('../Models/venueModel');

const addVenue = asyncHandler(async (req, res) => {
    const { name, description, type, price, capacity, phone } = req.body

    if (!name) {
        res.status(StatusCode.BAD_REQUEST)
        throw new Error("Name is required");
    }
    if (!description) {
        res.status(StatusCode.BAD_REQUEST)
        throw new Error("Description is required");
    }
    if (!type) {
        res.status(StatusCode.BAD_REQUEST)
        throw new Error("Type is required");
    }
    if (!price) {
        res.status(StatusCode.BAD_REQUEST)
        throw new Error("Price is required");
    }
    if (!capacity) {
        res.status(StatusCode.BAD_REQUEST)
        throw new Error("Capacity is required");
    }
    if (!phone) {
        res.status(StatusCode.BAD_REQUEST)
        throw new Error("Phone is required");
    }

    const venue = await Venue.create({
        name, description, type, price, capacity, phone
    })
    return res.status(StatusCode.OK).json({
        status: "success",
        message: "Venue added successfully",
        venue
    })
})

module.exports=addVenue