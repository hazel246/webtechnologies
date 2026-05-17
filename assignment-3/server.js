require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 3000;
const PRODUCTS_PER_PAGE = 8;

// View engine & static files
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Home route – redirect to products
app.get("/", (req, res) => res.redirect("/products"));

// Products route with pagination, search, category filter, and price range
app.get("/products", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const search = req.query.search?.trim() || "";
    const category = req.query.category?.trim() || "";
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

    // Build the MongoDB filter object
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    filter.price = { $gte: minPrice };
    if (req.query.maxPrice) {
      filter.price.$lte = maxPrice;
    }

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
    const currentPage = Math.min(page, totalPages || 1);
    const skip = (currentPage - 1) * PRODUCTS_PER_PAGE;

    const products = await Product.find(filter)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(PRODUCTS_PER_PAGE);

    // Distinct categories for the filter dropdown
    const categories = await Product.distinct("category");

    res.render("products", {
      products,
      categories,
      currentPage,
      totalPages,
      totalProducts,
      // Pass query params back so the form stays populated
      filters: {
        search,
        category,
        minPrice: req.query.minPrice || "",
        maxPrice: req.query.maxPrice || "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error: " + err.message);
  }
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
