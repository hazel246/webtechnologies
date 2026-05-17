const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders } = require("../../controllers/orderController");
const { verifyToken } = require("../../middleware/verifyToken");

// All order routes require authentication
router.use(verifyToken);

/**
 * @route  POST /api/v1/orders
 * @desc   Submit a new order (deducts stock, snapshots prices)
 * @access Protected
 *
 * Request body:
 * {
 *   "items": [{ "productId": "<id>", "quantity": 2 }],
 *   "shippingAddress": "House 5, Street 7, Lahore"
 * }
 */
router.post("/", createOrder);

/**
 * @route  GET /api/v1/orders
 * @desc   Return all orders belonging to the authenticated user
 * @access Protected
 */
router.get("/", getMyOrders);

module.exports = router;
