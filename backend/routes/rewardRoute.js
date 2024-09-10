const express = require('express');
const { getRewards, createReward } = require('../controllers/rewardController');
const router = express.Router();

// Public route to get all rewards
router.get('/', getRewards);

// Admin route to create a reward
router.post('/', createReward);

module.exports = router;
