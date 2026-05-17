const express = require("express");
const router = express.Router();
const { getProfile } = require("../../controllers/userController");
const { verifyToken } = require("../../middleware/verifyToken");

// All user routes require authentication
router.use(verifyToken);

/**
 * @route  GET /api/v1/user/profile
 * @desc   Return the authenticated user's profile and recent orders
 * @access Protected
 */
router.get("/profile", getProfile);

module.exports = router;
