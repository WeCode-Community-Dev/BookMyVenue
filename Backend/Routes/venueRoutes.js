const express=require('express')
const addVenue = require('../Controllers/venueController')
const router = express.Router()

router.route('/add').post(addVenue)

module.exports=router