const asyncHandler = require('express-async-handler');
const Reward = require('../models/rewardModel');

// Get all rewards
const getRewards = asyncHandler(async (req, res) => {
  const rewards = await Reward.find({});
  res.json(rewards);
});

// Create new reward
const createReward = asyncHandler(async (req, res) => {
  const { title, description, pointsRequired } = req.body;

  const reward = new Reward({
    title,
    description,
    pointsRequired,
  });

  const createdReward = await reward.save();
  res.status(201).json(createdReward);
});

module.exports = { getRewards, createReward };
