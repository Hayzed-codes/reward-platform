const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUsers, getUser, logoutUser } = require('../controllers/userController');
const {verifyToken} = require("../middleware/authMiddleware")

router.post('/create', registerUser);
router.post('/login', authUser);
router.get("/", getUsers)
router.get("/auth-user", verifyToken, getUser)
router.post("/logout", logoutUser)

module.exports = router;
