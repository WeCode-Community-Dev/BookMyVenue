const mongoose = require('mongoose')
const { Schema } = mongoose

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique:true
    }
})
const Category = mongoose.model('Category', categorySchema);
module.exports = Category