const asyncHandler = require('express-async-handler');
const StatusCode = require('../statusCode');
const Venue = require('../Models/venueModel');

const addVenue = asyncHandler(async (req, res) => {
    const { name, description, price, capacity, phone } = req.body
console.log(req.body)
const files = req.files;
    if (!name) {
        res.status(StatusCode.BAD_REQUEST)
        throw new Error("Name is required");
    }
    if (!description) {
        res.status(StatusCode.BAD_REQUEST)
        throw new Error("Description is required");
    }
    // if (!type) {
    //     res.status(StatusCode.BAD_REQUEST)
    //     throw new Error("Type is required");
    // }
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
    if (!files || files.length === 0) {
    res.status(StatusCode.BAD_REQUEST)
    throw new Error("At least three images are required");
  }
  const imageUrls = files.map((file) => file.path);

    const venue = await Venue.create({
        name, description, price, capacity, phone,
        image:imageUrls
    })
    return res.status(StatusCode.OK).json({
        status: "success",
        message: "Venue added successfully",
        venue
    })
})

module.exports=addVenue