require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 3001;
const PRODUCTS_PER_PAGE = 8;
const CATEGORIES = ["Solar Panels", "Inverters", "Batteries", "Accessories", "Mounting Systems"];

// ── Multer setup ──────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WEBP, or GIF images are allowed."));
    }
  },
});

// ── App config ────────────────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err.message));

// ── Helper: delete old upload file ───────────────────────────────────────────
function deleteUploadFile(imagePath) {
  if (!imagePath) return;
  const fullPath = path.join(__dirname, "public", imagePath);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
}

// ═════════════════════════════════════════════════════════════════════════════
//  PUBLIC: /products
// ═════════════════════════════════════════════════════════════════════════════

app.get("/", (req, res) => res.redirect("/products"));

app.get("/products", async (req, res) => {
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
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
    const currentPage = Math.min(page, totalPages || 1);
    const products = await Product.find(filter)
      .sort({ _id: 1 })
      .skip((currentPage - 1) * PRODUCTS_PER_PAGE)
      .limit(PRODUCTS_PER_PAGE);

    const categories = await Product.distinct("category");
    res.render("products", {
      products, categories, currentPage, totalPages, totalProducts,
      filters: { search, category, minPrice: req.query.minPrice || "", maxPrice: req.query.maxPrice || "" },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error: " + err.message);
  }
});

// ═════════════════════════════════════════════════════════════════════════════
//  ADMIN: /admin
// ═════════════════════════════════════════════════════════════════════════════

// Dashboard
app.get("/admin", (req, res) => res.redirect("/admin/dashboard"));

app.get("/admin/dashboard", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    // Summary stats
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const avgPrice = totalProducts
      ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / totalProducts)
      : 0;

    // Stock per category
    const byCategory = {};
    products.forEach((p) => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    });

    res.render("admin/dashboard", {
      products, totalProducts, totalStock, lowStock, outOfStock, avgPrice,
      byCategory, categories: CATEGORIES,
      success: req.query.success || null,
      error: req.query.error || null,
    });
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

// ── Add product ───────────────────────────────────────────────────────────────
app.get("/admin/products/add", (req, res) => {
  res.render("admin/add", { categories: CATEGORIES, errors: [], old: {} });
});

app.post("/admin/products/add", upload.single("image"), async (req, res) => {
  const { name, price, category, rating, stock, description } = req.body;
  const errors = [];

  if (!name?.trim()) errors.push("Product name is required.");
  if (!price || isNaN(price) || Number(price) < 0) errors.push("A valid price is required.");
  if (!category || !CATEGORIES.includes(category)) errors.push("Please select a valid category.");
  if (!rating || isNaN(rating) || rating < 1 || rating > 5) errors.push("Rating must be between 1 and 5.");
  if (stock === undefined || stock === "" || isNaN(stock) || Number(stock) < 0) errors.push("Stock must be 0 or more.");

  if (errors.length) {
    if (req.file) deleteUploadFile("/uploads/" + req.file.filename);
    return res.render("admin/add", { categories: CATEGORIES, errors, old: req.body });
  }

  try {
    await Product.create({
      name: name.trim(),
      price: Number(price),
      category,
      rating: Number(rating),
      stock: Number(stock),
      description: description?.trim() || "",
      image: req.file ? "/uploads/" + req.file.filename : null,
    });
    res.redirect("/admin/dashboard?success=Product added successfully");
  } catch (err) {
    if (req.file) deleteUploadFile("/uploads/" + req.file.filename);
    res.render("admin/add", { categories: CATEGORIES, errors: [err.message], old: req.body });
  }
});

// ── Edit product ──────────────────────────────────────────────────────────────
app.get("/admin/products/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect("/admin/dashboard?error=Product not found");
    res.render("admin/edit", { product, categories: CATEGORIES, errors: [] });
  } catch {
    res.redirect("/admin/dashboard?error=Invalid product ID");
  }
});

app.post("/admin/products/edit/:id", upload.single("image"), async (req, res) => {
  const { name, price, category, rating, stock, description } = req.body;
  const errors = [];

  if (!name?.trim()) errors.push("Product name is required.");
  if (!price || isNaN(price) || Number(price) < 0) errors.push("A valid price is required.");
  if (!category || !CATEGORIES.includes(category)) errors.push("Please select a valid category.");
  if (!rating || isNaN(rating) || rating < 1 || rating > 5) errors.push("Rating must be between 1 and 5.");
  if (stock === undefined || stock === "" || isNaN(stock) || Number(stock) < 0) errors.push("Stock must be 0 or more.");

  if (errors.length) {
    if (req.file) deleteUploadFile("/uploads/" + req.file.filename);
    try {
      const product = await Product.findById(req.params.id);
      return res.render("admin/edit", { product, categories: CATEGORIES, errors });
    } catch {
      return res.redirect("/admin/dashboard?error=Product not found");
    }
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect("/admin/dashboard?error=Product not found");

    // If a new image was uploaded, delete the old one
    if (req.file && product.image) deleteUploadFile(product.image);

    product.name = name.trim();
    product.price = Number(price);
    product.category = category;
    product.rating = Number(rating);
    product.stock = Number(stock);
    product.description = description?.trim() || "";
    if (req.file) product.image = "/uploads/" + req.file.filename;

    await product.save();
    res.redirect("/admin/dashboard?success=Product updated successfully");
  } catch (err) {
    if (req.file) deleteUploadFile("/uploads/" + req.file.filename);
    res.redirect("/admin/dashboard?error=" + err.message);
  }
});

// ── Delete product ────────────────────────────────────────────────────────────
app.post("/admin/products/delete/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product?.image) deleteUploadFile(product.image);
    res.redirect("/admin/dashboard?success=Product deleted successfully");
  } catch {
    res.redirect("/admin/dashboard?error=Could not delete product");
  }
});

// ── Multer error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.includes("Only")) {
    return res.redirect(
      (req.path.includes("edit") ? req.path : "/admin/products/add") +
        "?uploadError=" + encodeURIComponent(err.message)
    );
  }
  next(err);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
