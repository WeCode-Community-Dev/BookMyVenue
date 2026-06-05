const express=require('express')
const addVenue = require('../Controllers/venueController')
const { imageUpload } = require('../config/cloudConfig')
const router = express.Router()

router.route('/add').post(imageUpload.array("image"),addVenue)

module.exports=router