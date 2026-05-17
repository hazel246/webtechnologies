const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /auth/register
router.get("/register", (req, res) => {
  if (req.session.userId) return res.redirect("/products");
  res.render("auth/register", { errors: [], old: {} });
});

// POST /auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  if (!name?.trim()) errors.push("Name is required.");
  if (!email?.trim()) errors.push("Email is required.");
  if (!password || password.length < 6) errors.push("Password must be at least 6 characters.");
  if (password !== confirmPassword) errors.push("Passwords do not match.");

  if (errors.length) {
    return res.render("auth/register", { errors, old: { name, email } });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.render("auth/register", {
        errors: ["An account with that email already exists."],
        old: { name, email },
      });
    }

    const user = await User.create({ name: name.trim(), email, password });
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.userRole = user.role;
    req.flash("success", `Welcome to MFES Solar, ${user.name}!`);
    res.redirect("/products");
  } catch (err) {
    res.render("auth/register", {
      errors: [err.message],
      old: { name, email },
    });
  }
});

// GET /auth/login
router.get("/login", (req, res) => {
  if (req.session.userId) return res.redirect("/products");
  res.render("auth/login", { errors: [] });
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email?.trim()) errors.push("Email is required.");
  if (!password) errors.push("Password is required.");
  if (errors.length) return res.render("auth/login", { errors });

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.render("auth/login", { errors: ["Invalid email or password."] });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.render("auth/login", { errors: ["Invalid email or password."] });
    }

    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.userRole = user.role;

    req.flash("success", `Welcome back, ${user.name}!`);
    const redirect = req.session.returnTo || (user.role === "admin" ? "/admin/dashboard" : "/products");
    delete req.session.returnTo;
    res.redirect(redirect);
  } catch (err) {
    res.render("auth/login", { errors: [err.message] });
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  const name = req.session.userName;
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    // Can't use flash after session destroy, so we pass the message via query
    res.redirect("/auth/login?loggedOut=1&name=" + encodeURIComponent(name || ""));
  });
});

module.exports = router;
