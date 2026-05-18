const express = require("express");
const router  = express.Router();
const User    = require("../models/User");

// GET login
router.get("/login", (req, res) => {
  if (req.session.userId) return res.redirect("/");
  res.render("auth/login");
});

// POST login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Please fill in all fields.");
    return res.redirect("/auth/login");
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/auth/login");
    }
    req.session.userId   = user._id;
    req.session.userName = user.name;
    req.session.userRole = user.role;
    req.flash("success", `Welcome back, ${user.name}!`);
    res.redirect(user.role === "admin" ? "/admin" : "/products");
  } catch (err) {
    req.flash("error", "Login failed. Try again.");
    res.redirect("/auth/login");
  }
});

// GET register
router.get("/register", (req, res) => {
  if (req.session.userId) return res.redirect("/");
  res.render("auth/register");
});

// POST register
router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];
  if (!name || !email || !password) errors.push("All fields are required.");
  if (password !== confirmPassword)  errors.push("Passwords do not match.");
  if (password && password.length < 6) errors.push("Password must be at least 6 characters.");
  if (errors.length) {
    req.flash("error", errors.join(" "));
    return res.redirect("/auth/register");
  }
  try {
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      req.flash("error", "Email already registered.");
      return res.redirect("/auth/register");
    }
    const user = await User.create({ name, email, password, role: "customer" });
    req.session.userId   = user._id;
    req.session.userName = user.name;
    req.session.userRole = user.role;
    req.flash("success", `Welcome, ${user.name}! Account created.`);
    res.redirect("/products");
  } catch (err) {
    req.flash("error", "Registration failed.");
    res.redirect("/auth/register");
  }
});

// POST logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

module.exports = router;
