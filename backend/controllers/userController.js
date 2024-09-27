const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/index");
const bcrypt = require("bcryptjs");
const Wallet = require("../models/walletModel");

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Create a wallet for the new user with an initial balance of 0
    const wallet = await Wallet.create({
      userId: user._id,
      balance: 0, // Initial balance set to 0
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      walletBalance: wallet.balance, // Optionally return initial wallet balance
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Auth user & get token
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(user._id)
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "strict",
      secure: false,
    });
   return  res.status(200).json(user);
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const getUsers= asyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users) {
      res.status(500);
      throw new Error("Something went wrong");
  }
  res.status(200).json(users);
});
const getUser = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const user = await User.findById(userId);
  if (!user) {
    return  res.status(500).json({message: "no user found"});
  }
 return res.status(200).json(user);
});

const logoutUser = async (req, res) => {
  res.cookie("token", "none", {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now()), // Set expiration to now to effectively delete the cookie
    sameSite: "none",
    secure: true,
  });

  res.status(201).json({ message: "User logged out successfully" });
};

module.exports = { registerUser, authUser, getUsers, getUser, logoutUser};
