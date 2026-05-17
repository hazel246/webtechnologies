require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3002;

// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err.message));

// ── View engine & static files ────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// ── Body parsing & method override ───────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// ── Sessions (stored in MongoDB) ──────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
  })
);

// ── Flash messages ────────────────────────────────────────────────────────────
app.use(flash());

// ── Global locals (available in every EJS template) ──────────────────────────
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId
    ? { id: req.session.userId, name: req.session.userName, role: req.session.userRole }
    : null;
  res.locals.successFlash = req.flash("success");
  res.locals.errorFlash = req.flash("error");
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.redirect("/products"));

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/admin", adminRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
