const express    = require("express");
const router     = express.Router();
const path       = require("path");
const fs         = require("fs");
const multer     = require("multer");
const Product    = require("../models/Product");
const { isAdmin } = require("../middleware/auth");

const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Images only"));
  }
});

function deleteFile(p) {
  if (!p || !p.startsWith("/uploads/")) return;
  const full = path.join(__dirname, "../public", p);
  if (fs.existsSync(full)) fs.unlinkSync(full);
}

const CATEGORIES = ["Solar Panels","Inverters","Batteries","Accessories","Mounting Systems"];

router.use(isAdmin);

// Dashboard
router.get(["/", "/dashboard"], async (req, res) => {
  try {
    const products    = await Product.find().sort({ _id: 1 });
    const totalProducts = products.length;
    const totalStock    = products.reduce((s, p) => s + p.stock, 0);
    const lowStock      = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStock    = products.filter(p => p.stock === 0).length;
    res.render("admin/dashboard", { products, totalProducts, totalStock, lowStock, outOfStock, CATEGORIES });
  } catch (err) { res.status(500).send(err.message); }
});

// Add form
router.get("/add", (req, res) => res.render("admin/add", { CATEGORIES, errors: [], old: {} }));

// Add POST
router.post("/add", upload.single("image"), async (req, res) => {
  const { name, price, category, rating, stock, description } = req.body;
  const errors = [];
  if (!name.trim())              errors.push("Name is required.");
  if (isNaN(price) || price < 0) errors.push("Valid price required.");
  if (!CATEGORIES.includes(category)) errors.push("Valid category required.");

  if (errors.length) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.render("admin/add", { CATEGORIES, errors, old: req.body });
  }
  const image = req.file ? `/uploads/${req.file.filename}` : "";
  await Product.create({ name: name.trim(), price: parseFloat(price), category, rating: parseInt(rating) || 4, stock: parseInt(stock) || 0, description: description?.trim() || "", image });
  req.flash("success", "Product added successfully.");
  res.redirect("/admin");
});

// Edit form
router.get("/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect("/admin");
    res.render("admin/edit", { product, CATEGORIES, errors: [] });
  } catch { res.redirect("/admin"); }
});

// Edit POST
router.post("/edit/:id", upload.single("image"), async (req, res) => {
  const { name, price, category, rating, stock, description } = req.body;
  const errors = [];
  if (!name.trim())              errors.push("Name is required.");
  if (isNaN(price) || price < 0) errors.push("Valid price required.");

  if (errors.length) {
    if (req.file) fs.unlinkSync(req.file.path);
    const product = await Product.findById(req.params.id);
    return res.render("admin/edit", { product, CATEGORIES, errors });
  }
  const product = await Product.findById(req.params.id);
  if (req.file) {
    deleteFile(product.image);
    product.image = `/uploads/${req.file.filename}`;
  }
  product.name        = name.trim();
  product.price       = parseFloat(price);
  product.category    = category;
  product.rating      = parseInt(rating) || 4;
  product.stock       = parseInt(stock) || 0;
  product.description = description?.trim() || "";
  await product.save();
  req.flash("success", "Product updated.");
  res.redirect("/admin");
});

// Delete POST
router.post("/delete/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) deleteFile(product.image);
  req.flash("success", "Product deleted.");
  res.redirect("/admin");
});

module.exports = router;
