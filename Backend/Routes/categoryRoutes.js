const express=require('express')
const {addCategory,listCategories}= require('../Controllers/categoryController')
const router = express.Router()

router.route('/add').post(addCategory)
router.route('/categories').get(listCategories)

module.exports=router