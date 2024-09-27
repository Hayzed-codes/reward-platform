const express = require("express");
const RevenueData = require("../controllers/revenueController")
const router = express.Router();

router.get('/api/revenue', RevenueData)

module.exports = router