const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById } = require("../../controllers/productController");

/**
 * @route  GET /api/v1/products
 * @desc   Return paginated, filterable product list
 * @access Public
 *
 * Query params:
 *   page      – page number (default: 1)
 *   limit     – items per page (default: 8, max: 50)
 *   search    – filter by product name (case-insensitive)
 *   category  – filter by category
 *   minPrice  – minimum price (PKR)
 *   maxPrice  – maximum price (PKR)
 */
router.get("/", getAllProducts);

/**
 * @route  GET /api/v1/products/:id
 * @desc   Return a single product by its MongoDB ObjectId
 * @access Public
 */
router.get("/:id", getProductById);

module.exports = router;
