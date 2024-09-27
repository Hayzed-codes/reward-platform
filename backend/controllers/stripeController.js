const Stripe = require('stripe')
const asyncHandler = require("express-async-handler");
const stripe = Stripe("sk_test_51PqZGPDET1b9VVadyCdVGwXLHPW2VXuiImvCJLqrkn0cDZsCQ09euwI22TOXxaDPVSBaC1CD5ME5vy0pkfkqGBZr005rnL1hKI");
const {  v4: uuidv4 } = require("uuid")
const User = require("../models/userModel");
const Wallet = require('../models/walletModel');


// const processPayment = async (req, res) => {
//   try {
//     // Destructure email, amount, and token from the request body
//     const { email, amount, token } = req.body;

//     // Check if any of the required fields are missing
//     if (!email || !amount || !token) {
//       return res.status(400).json({ message: 'Email, amount, and token are required.' });
//     }

//     // Log the received amount for debugging
//     console.log('Received amount (string):', amount);

//     // Convert the amount from a string to a number in cents
//     const amountInCents = Math.round(parseFloat(amount) * 100);

//     // Log the converted amount for debugging
//     console.log('Converted amount (number):', amountInCents);

//     // Validate the converted amount
//     if (amountInCents < 100) {
//       return res.status(400).json({ message: 'Amount must be greater than or equal to 1 USD' });
//     }

//     // Create a charge with Stripe
//     const charge = await stripe.charges.create({
//       amount: amountInCents, // Amount in cents
//       currency: 'usd',
//       source: token,
//       description:` Deposit by ${email},`
//     });

//     // Fetch the user from the database
//     const user = await User.findOne({ email: email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update the user's balance
//     const depositAmount = parseFloat(amount);
//     user.balance = (parseFloat(user.balance) || 0) + depositAmount;

//     // Save the updated user data
//     await user.save();

//     // Send the updated balance in the response
//     res.status(200).json({ balance: user.balance });
//   } catch (error) {
//     // Log the error for debugging
//     console.error('Error processing payment:', error);

//     // Respond with an error message
//     res.status(500).json({ message: 'Deposit failed', error: error.message });
//   }
// };

// // Controller function for processing withdrawals
// const processWithdrawal = async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const userId = req.user.id; // Assuming user ID is available from authentication

//     if (!amount) {
//       return res.status(400).json({ message: 'Amount is required.' });
//     }

//     // Fetch the user from the database
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const amountInNumber = parseFloat(amount);
//     if (user.balance < amountInNumber) {
//       return res.status(400).json({ message: 'Insufficient funds' });
//     }

//     // Deduct the amount from the user's balance
//     user.balance -= amountInNumber;
//     await user.save();

//     // Return the updated balance
//     res.status(200).json({ balance: user.balance });
//   } catch (error) {
//     console.error('Error processing withdrawal:', error);
//     res.status(500).json({ message: 'Withdrawal failed', error: error.message });
//   }
// };
// // To get the balance
// const getWalletBalance = async (req, res) => {
//   const { userId } = req.params; // Assuming userId is passed as a parameter
//   console.log("Received userId:", userId); // For debugging

//   try {
//     // Find the wallet for the specified user
//     let wallet = await Wallet.findOne({ userId });

//     // If the wallet is not found, return an error (or create a new wallet if that's your logic)
//     if (!wallet) {
//       return res.status(404).json({ message: 'Wallet not found' });
//     }

//     // Return the balance in the response
//     res.status(200).json({ balance: wallet.balance });
//   } catch (error) {
//     console.error('Error fetching wallet balance:', error);
//     res.status(500).json({ message: 'Error fetching wallet balance', error: error.message });
//   }
// };



// // Add funds to a user's wallet
// const addFundsToWallet = async (req, res) => {
//   try {
//     // Destructure userId and amount from the request body
//     const { userId, amount } = req.body;

//     // Check if required fields are present
//     if (!userId || !amount) {
//       return res.status(400).json({ message: 'User ID and amount are required.' });
//     }

//     // Convert the amount from string to a number in cents
//     const amountInCents = Math.round(parseFloat(amount) * 100);

//     // Validate the converted amount
//     if (amountInCents < 100) {
//       return res.status(400).json({ message: 'Amount must be greater than or equal to 1 USD' });
//     }

//     // Find the user by their ID in the database
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update the user's wallet balance
//     const depositAmount = parseFloat(amount);
//     user.balance = (parseFloat(user.balance) || 0) + depositAmount;

//     // Save the updated user data
//     await user.save();

//     // Return the updated balance
//     res.status(200).json({ balance: user.balance });
//   } catch (error) {
//     console.error('Error adding funds:', error);
//     res.status(500).json({ message: 'Error adding funds', error: error.message });
//   }
// };



// module.exports = { processPayment, processWithdrawal, getWalletBalance,addFundsToWallet };



const  addPayment = async (req, res) => {
  try {
    const { token, amount } = req.body;
    const idempotencyKey = uuidv4();

    console.log('Received token:', token);

    // Create a PaymentIntent with the correct payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
      payment_method: token.id, // Pass the correct token.id here
      confirmation_method: 'manual', // You will confirm the payment manually
      receipt_email: token.email,
      return_url: 'http://localhost:3500/userdash',
    }, { idempotencyKey });

    // Manually confirm the payment intent
    const confirmedIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      { payment_method: token.id } // Ensure you're confirming with the correct token.id
    );

    console.log('Confirmed PaymentIntent result:', confirmedIntent);
    return res.status(200).json(confirmedIntent);
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ message: 'Payment processing failed', error: error.message });
  }
};





module.exports = {addPayment}