const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../../controllers/authController");
const { verifyToken } = require("../../middleware/verifyToken");

/**
 * @route  POST /api/v1/auth/register
 * @desc   Register a new user and return a JWT
 * @access Public
 */
router.post("/register", register);

/**
 * @route  POST /api/v1/auth/login
 * @desc   Authenticate user with email/password, return a signed JWT
 * @access Public
 */
router.post("/login", login);

/**
 * @route  GET /api/v1/auth/me
 * @desc   Return the currently authenticated user's basic info
 * @access Protected (JWT required)
 */
router.get("/me", verifyToken, getMe);

module.exports = router;
