const mongoose = require('mongoose');

const rewardSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pointsRequired: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reward = mongoose.model('Reward', rewardSchema);

module.exports = Reward;
