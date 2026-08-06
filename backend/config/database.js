const mongoose = require("mongoose");
const { mongodbConnectionUrl } = require("./config");

module.exports.connectDB = async () => {
   await mongoose.connect(mongodbConnectionUrl);
}