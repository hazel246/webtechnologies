const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─── Helper: sign a JWT token ───────────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { user_id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
}

// ─── Helper: standard success response with token ───────────────────────────
function sendTokenResponse(res, statusCode, user, message) {
  const token = signToken(user);

  // Decode to get expiry for the response body
  const decoded = jwt.decode(token);

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      token,
      token_type: "Bearer",
      expires_at: new Date(decoded.exp * 1000).toISOString(),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
}

// ────────────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/register
// ────────────────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Manual validation
    const errors = [];
    if (!name?.trim()) errors.push("Name is required.");
    if (!email?.trim()) errors.push("Email is required.");
    if (!password || password.length < 6)
      errors.push("Password must be at least 6 characters.");

    if (errors.length) {
      return res.status(400).json({ success: false, message: "Validation failed.", errors });
    }

    // Check for duplicate email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with that email already exists.",
        error: "EMAIL_TAKEN",
      });
    }

    // Create user (pre-save hook hashes the password automatically)
    const user = await User.create({ name: name.trim(), email, password });
    sendTokenResponse(res, 201, user, "Account created successfully.");
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error.", error: err.message });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/login
// ────────────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Explicitly select password (it's excluded by default via `select: false`)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      // Generic message — don't reveal whether the email exists
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        error: "INVALID_CREDENTIALS",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        error: "INVALID_CREDENTIALS",
      });
    }

    sendTokenResponse(res, 200, user, `Welcome back, ${user.name}!`);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error.", error: err.message });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// GET /api/v1/auth/me  (requires verifyToken)
// Returns the currently authenticated user's public profile
// ────────────────────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error.", error: err.message });
  }
};
