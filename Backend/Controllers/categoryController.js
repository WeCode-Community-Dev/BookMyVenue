const asyncHandler = require('express-async-handler');
const StatusCode = require('../statusCode');
const Category = require('../Models/categoryModel');

const addCategory = asyncHandler(async (req, res) => {
    const { name } = req.body

    if (!name) {
        res.status(StatusCode.BAD_REQUEST)
        throw new Error("Name is required");
    }
    const category = await Category.create({
        name,
    })
    await category.save()
    console.log(category)
    return res.status(StatusCode.OK).json({
        status: "success",
        message: "Venue added successfully",

    })
})

const listCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    console.log(categories)
    return res.status(StatusCode.OK).json({
        status: "success",
        categories
    })
})

module.exports = { addCategory, listCategories }