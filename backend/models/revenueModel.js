const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema({
  totalRevenue: {
    type: Number,
    required: true,
    default: 0, // Starting revenue
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date when revenue is created or updated
  },
});

// Create the Mongoose model for revenue
const Revenue = mongoose.model("Revenue", revenueSchema);
module.exports = Revenue;
