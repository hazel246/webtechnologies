require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes    = require("./routes/api/auth");
const productRoutes = require("./routes/api/products");
const orderRoutes   = require("./routes/api/orders");
const userRoutes    = require("./routes/api/user");

const app = express();
const PORT = process.env.PORT || 4000;

// ── MongoDB connection ────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err.message));

// ── Global middleware ─────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/v1/auth",     authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders",   orderRoutes);
app.use("/api/v1/user",     userRoutes);

// ── API root — endpoint map ───────────────────────────────────────────────────
app.get("/api/v1", (req, res) => {
  res.json({
    success: true,
    message: "MFES Solar Energy — REST API v1",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/v1/auth/register": "Register a new account",
        "POST /api/v1/auth/login":    "Login and receive a JWT",
        "GET  /api/v1/auth/me":       "Get current user info [Protected]",
      },
      products: {
        "GET /api/v1/products":      "List products (paginated + filtered)",
        "GET /api/v1/products/:id":  "Get a single product",
      },
      orders: {
        "POST /api/v1/orders": "Place an order [Protected]",
        "GET  /api/v1/orders": "Get my orders [Protected]",
      },
      user: {
        "GET /api/v1/user/profile": "Get my profile & order summary [Protected]",
      },
    },
    note: "Protected endpoints require: Authorization: Bearer <token>",
  });
});

// Root redirect
app.get("/", (req, res) => res.redirect("/api/v1"));

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
    error: "ROUTE_NOT_FOUND",
  });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "An unexpected server error occurred.",
    error: "SERVER_ERROR",
  });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
  console.log(`API docs:           http://localhost:${PORT}/api/v1`);
});
