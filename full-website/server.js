require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3005;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB error:", err.message));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Flash
app.use(flash());

// Global locals
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId
    ? { id: req.session.userId, name: req.session.userName, role: req.session.userRole }
    : null;
  res.locals.successFlash = req.flash("success");
  res.locals.errorFlash   = req.flash("error");
  next();
});

// Routes
app.use("/",        require("./routes/home"));
app.use("/products",require("./routes/products"));
app.use("/auth",    require("./routes/auth"));
app.use("/admin",   require("./routes/admin"));

// Checkout (protected)
const { isLoggedIn } = require("./middleware/auth");
app.get("/checkout", isLoggedIn, (req, res) => {
  res.render("checkout", { title: "Checkout" });
});

app.listen(PORT, () => console.log(`Full website running at http://localhost:${PORT}`));
