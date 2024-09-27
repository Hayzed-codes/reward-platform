// models/Wallet.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User',
  },
  balance: {
    type: Number,
    required: true,
    default: 0, // Initial balance can be set to 0
  },
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
