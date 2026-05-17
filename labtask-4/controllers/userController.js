const User = require("../models/User");
const Order = require("../models/Order");

// ────────────────────────────────────────────────────────────────────────────
// GET /api/v1/user/profile  (Protected — verifyToken required)
// Returns the authenticated user's profile + order summary
// ────────────────────────────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found. It may have been deleted.",
        error: "USER_NOT_FOUND",
      });
    }

    // Order summary for the profile
    const totalOrders = await Order.countDocuments({ user: user._id });
    const recentOrders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("items.product", "name category");

    res.json({
      success: true,
      data: {
        profile: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          memberSince: user.createdAt,
        },
        orderSummary: {
          totalOrders,
          recentOrders,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error.", error: err.message });
  }
};
