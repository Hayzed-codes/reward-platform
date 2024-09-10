const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const User = require("../models/userModel");

const processPayment = async (req, res) => {
  try {
    // Destructure email, amount, and token from the request body
    const { email, amount, token } = req.body;

    // Check if any of the required fields are missing
    if (!email || !amount || !token) {
      return res.status(400).json({ message: 'Email, amount, and token are required.' });
    }

    // Log the received amount for debugging
    console.log('Received amount (string):', amount);

    // Convert the amount from a string to a number in cents
    const amountInCents = Math.round(parseFloat(amount) * 100);

    // Log the converted amount for debugging
    console.log('Converted amount (number):', amountInCents);

    // Validate the converted amount
    if (amountInCents < 100) {
      return res.status(400).json({ message: 'Amount must be greater than or equal to 1 USD' });
    }

    // Create a charge with Stripe
    const charge = await stripe.charges.create({
      amount: amountInCents, // Amount in cents
      currency: 'usd',
      source: token, 
      description: `Deposit by ${email}`,
    });

    // Fetch the user from the database
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's balance
    const depositAmount = parseFloat(amount);
    user.balance = (parseFloat(user.balance) || 0) + depositAmount;

    // Save the updated user data
    await user.save();

    // Send the updated balance in the response
    res.status(200).json({ balance: user.balance });
  } catch (error) {
    // Log the error for debugging
    console.error('Error processing payment:', error);

    // Respond with an error message
    res.status(500).json({ message: 'Deposit failed', error: error.message });
  }
};

module.exports = { processPayment
};