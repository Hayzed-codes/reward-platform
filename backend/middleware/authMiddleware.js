const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const verifyToken = asyncHandler(async (req, res, next) => {

  const token = req.cookies.token

  console.log("toke", token)
    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET, {algorithms: ["HS256"]});

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
     return  res.status(401);
    }
  

  if (!token) {
    return res.status(401).json({messsage:'Not authorized, no token'});
  }
});


const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { verifyToken, admin };
