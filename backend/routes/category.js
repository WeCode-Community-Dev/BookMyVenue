const express = require("express");
const listCategories = require("../controllers/category/listCategories");

const router = express.Router();

router.get("/", listCategories);

module.exports = router;
