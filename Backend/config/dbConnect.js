const mongoose = require('mongoose')
require('dotenv').config()
const URI = process.env.MONGO_URI

//database connection
const dbConnect = async () => {
    try {

        await mongoose.connect(URI)
        console.log("Connected to database")

    } catch (error) {
        console.error(`ERROR:${error.message}`)
        process.exit(1)
    }
}

module.exports = dbConnect