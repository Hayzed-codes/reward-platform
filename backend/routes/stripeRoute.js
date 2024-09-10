const express = require('express');
const { processPayment} = require('../controllers/paymentController');
const { protect } = require('../controllers/middleware/authMiddleware'); // Assuming you have middleware for authentication

const router = express.Router();

// Route to handle deposits
router.post('/deposit', processPayment);

// Route to handle withdrawals
router.post('/withdraw', protect, processWithdrawal);

module.exports = router;