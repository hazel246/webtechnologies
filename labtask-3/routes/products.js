const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { isLoggedIn } = require("../middleware/auth");

const PER_PAGE = 8;

// GET /products
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const search = req.query.search?.trim() || "";
    const category = req.query.category?.trim() || "";
    const minPrice = parseFloat(req.query.minPrice) || 0;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    filter.price = { $gte: minPrice };
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / PER_PAGE);
    const currentPage = Math.min(page, totalPages || 1);

    const products = await Product.find(filter)
      .sort({ _id: 1 })
      .skip((currentPage - 1) * PER_PAGE)
      .limit(PER_PAGE);

    const categories = await Product.distinct("category");

    res.render("products", {
      products, categories, currentPage, totalPages, totalProducts,
      filters: {
        search, category,
        minPrice: req.query.minPrice || "",
        maxPrice: req.query.maxPrice || "",
      },
    });
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

// GET /checkout  — protected route (requires login)
router.get("/checkout", isLoggedIn, (req, res) => {
  res.render("checkout");
});

module.exports = router;
