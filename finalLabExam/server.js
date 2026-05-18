require("dotenv").config();
const express         = require("express");
const mongoose        = require("mongoose");
const session         = require("express-session");
const MongoStore      = require("connect-mongo");
const flash           = require("connect-flash");
const methodOverride  = require("method-override");
const expressLayouts  = require("express-ejs-layouts");
const path            = require("path");

const app  = express();
const PORT = process.env.PORT || 3005;

// ── View engine ──────────────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// express-ejs-layouts — disabled by default, only onsale route uses it
app.use(expressLayouts);
app.set("layout", false);          // default: no layout wrapper for existing views

// ── Static files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB error:", err.message));

// ── Session ───────────────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// ── Flash ─────────────────────────────────────────────────────────────────────
app.use(flash());

// ── Global locals (available in every EJS view) ───────────────────────────────
app.use((req, res, next) => {
  res.locals.currentUser  = req.session.userId
    ? { id: req.session.userId, name: req.session.userName, role: req.session.userRole }
    : null;
  res.locals.successFlash = req.flash("success");
  res.locals.errorFlash   = req.flash("error");
  next();
});

// ── Existing routes (no layout) ───────────────────────────────────────────────
app.use("/",         require("./routes/home"));
app.use("/products", require("./routes/products"));
app.use("/auth",     require("./routes/auth"));
app.use("/admin",    require("./routes/admin"));

// ── Checkout (protected, no layout) ──────────────────────────────────────────
const { isLoggedIn } = require("./middleware/auth");
app.get("/checkout", isLoggedIn, (req, res) => {
  res.render("checkout", { title: "Checkout" });
});

// ── ON-SALE PRODUCTS route — uses express-ejs-layouts ────────────────────────
const Product = require("./models/Product");

app.get("/onsale-products", async (req, res) => {
  try {
    // Fetch ALL products where isOnSale is true from MongoDB
    const products = await Product.find({ isOnSale: true }).sort({ _id: 1 });

    // Render onsale.ejs wrapped inside layout.ejs
    res.render("onsale", {
      layout: "layout",          // use views/layout.ejs as the wrapper
      title: "On-Sale Products",
      products                   // pass full array — jQuery handles pagination client-side
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error: " + err.message);
  }
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Full website running at http://localhost:${PORT}`));
