const Product = require("../models/Product");

const PER_PAGE = 8;

// ────────────────────────────────────────────────────────────────────────────
// GET /api/v1/products
// Public — pagination, search, category filter, price range
// ────────────────────────────────────────────────────────────────────────────
exports.getAllProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || PER_PAGE); // allow custom limit, cap at 50
    const search = req.query.search?.trim() || "";
    const category = req.query.category?.trim() || "";
    const minPrice = parseFloat(req.query.minPrice) || 0;

    // Build filter
    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    filter.price = { $gte: minPrice };
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const currentPage = Math.min(page, totalPages || 1);

    const products = await Product.find(filter)
      .sort({ _id: 1 })
      .skip((currentPage - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage,
          totalPages,
          totalProducts,
          perPage: limit,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
        appliedFilters: {
          search: search || null,
          category: category || null,
          minPrice: req.query.minPrice ? minPrice : null,
          maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error.", error: err.message });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// GET /api/v1/products/:id
// Public — single product detail
// ────────────────────────────────────────────────────────────────────────────
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No product found with ID: ${req.params.id}`,
        error: "NOT_FOUND",
      });
    }
    res.json({ success: true, data: { product } });
  } catch (err) {
    // CastError means the :id is not a valid ObjectId format
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format.",
        error: "INVALID_ID",
      });
    }
    res.status(500).json({ success: false, message: "Server error.", error: err.message });
  }
};
