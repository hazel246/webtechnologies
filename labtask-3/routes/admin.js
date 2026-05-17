const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Product = require("../models/Product");
const { isAdmin } = require("../middleware/auth");

const CATEGORIES = ["Solar Panels", "Inverters", "Batteries", "Accessories", "Mounting Systems"];

// ── Multer ────────────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, "..", "public", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only JPEG, PNG, WEBP, or GIF images are allowed."));
  },
});

function deleteFile(imagePath) {
  if (!imagePath) return;
  const full = path.join(__dirname, "..", "public", imagePath);
  if (fs.existsSync(full)) fs.unlinkSync(full);
}

// Apply isAdmin to every route in this router
router.use(isAdmin);

// Dashboard
router.get(["/", "/dashboard"], async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: 1 });
    const totalProducts = products.length;
    const totalStock = products.reduce((s, p) => s + p.stock, 0);
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const avgPrice = totalProducts
      ? Math.round(products.reduce((s, p) => s + p.price, 0) / totalProducts)
      : 0;

    res.render("admin/dashboard", {
      products, totalProducts, totalStock, lowStock, outOfStock, avgPrice,
      categories: CATEGORIES,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add product — GET
router.get("/products/add", (req, res) => {
  res.render("admin/add", {
    categories: CATEGORIES, errors: [], old: {},
    uploadError: req.query.uploadError || null,
  });
});

// Add product — POST
router.post("/products/add", upload.single("image"), async (req, res) => {
  const { name, price, category, rating, stock, description } = req.body;
  const errors = [];
  if (!name?.trim()) errors.push("Product name is required.");
  if (!price || isNaN(price) || Number(price) < 0) errors.push("A valid price is required.");
  if (!category || !CATEGORIES.includes(category)) errors.push("Please select a valid category.");
  if (!rating || isNaN(rating) || rating < 1 || rating > 5) errors.push("Rating must be 1–5.");
  if (stock === undefined || stock === "" || isNaN(stock) || Number(stock) < 0)
    errors.push("Stock must be 0 or more.");

  if (errors.length) {
    if (req.file) deleteFile("/uploads/" + req.file.filename);
    return res.render("admin/add", { categories: CATEGORIES, errors, old: req.body, uploadError: null });
  }

  try {
    await Product.create({
      name: name.trim(), price: Number(price), category,
      rating: Number(rating), stock: Number(stock),
      description: description?.trim() || "",
      image: req.file ? "/uploads/" + req.file.filename : null,
    });
    req.flash("success", "Product added successfully.");
    res.redirect("/admin/dashboard");
  } catch (err) {
    if (req.file) deleteFile("/uploads/" + req.file.filename);
    res.render("admin/add", { categories: CATEGORIES, errors: [err.message], old: req.body, uploadError: null });
  }
});

// Edit product — GET
router.get("/products/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("/admin/dashboard");
    }
    res.render("admin/edit", { product, categories: CATEGORIES, errors: [] });
  } catch {
    req.flash("error", "Invalid product ID.");
    res.redirect("/admin/dashboard");
  }
});

// Edit product — POST
router.post("/products/edit/:id", upload.single("image"), async (req, res) => {
  const { name, price, category, rating, stock, description } = req.body;
  const errors = [];
  if (!name?.trim()) errors.push("Product name is required.");
  if (!price || isNaN(price) || Number(price) < 0) errors.push("A valid price is required.");
  if (!category || !CATEGORIES.includes(category)) errors.push("Please select a valid category.");
  if (!rating || isNaN(rating) || rating < 1 || rating > 5) errors.push("Rating must be 1–5.");
  if (stock === undefined || stock === "" || isNaN(stock) || Number(stock) < 0)
    errors.push("Stock must be 0 or more.");

  if (errors.length) {
    if (req.file) deleteFile("/uploads/" + req.file.filename);
    try {
      const product = await Product.findById(req.params.id);
      return res.render("admin/edit", { product, categories: CATEGORIES, errors });
    } catch {
      return res.redirect("/admin/dashboard");
    }
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("/admin/dashboard");
    }
    if (req.file && product.image) deleteFile(product.image);
    product.name = name.trim();
    product.price = Number(price);
    product.category = category;
    product.rating = Number(rating);
    product.stock = Number(stock);
    product.description = description?.trim() || "";
    if (req.file) product.image = "/uploads/" + req.file.filename;
    await product.save();
    req.flash("success", "Product updated successfully.");
    res.redirect("/admin/dashboard");
  } catch (err) {
    if (req.file) deleteFile("/uploads/" + req.file.filename);
    req.flash("error", err.message);
    res.redirect("/admin/dashboard");
  }
});

// Delete product — POST
router.post("/products/delete/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product?.image) deleteFile(product.image);
    req.flash("success", "Product deleted successfully.");
  } catch {
    req.flash("error", "Could not delete product.");
  }
  res.redirect("/admin/dashboard");
});

module.exports = router;
