const express = require('express');
const { addPayment } = require("../controllers/stripeController");


const router = express.Router();

// const secretKey = process.env.STRIPE_SECRET_KEY

// Route to handle deposits
router.post('/deposit', addPayment);






module.exports = router;