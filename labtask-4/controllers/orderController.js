const Order = require("../models/Order");
const Product = require("../models/Product");

// ────────────────────────────────────────────────────────────────────────────
// POST /api/v1/orders  (Protected — verifyToken required)
//
// Expected request body:
// {
//   "items": [
//     { "productId": "<id>", "quantity": 2 },
//     { "productId": "<id>", "quantity": 1 }
//   ],
//   "shippingAddress": "House 5, Street 7, Lahore"
// }
// ────────────────────────────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // ── Validate request body ──────────────────────────────────────────────
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item.",
        error: "EMPTY_ITEMS",
      });
    }

    const orderItems = [];
    let totalAmount = 0;
    const errors = [];

    // ── Validate each item and fetch current prices from DB ───────────────
    for (let i = 0; i < items.length; i++) {
      const { productId, quantity } = items[i];

      if (!productId) {
        errors.push(`Item ${i + 1}: productId is required.`);
        continue;
      }

      const qty = parseInt(quantity);
      if (!qty || qty < 1) {
        errors.push(`Item ${i + 1}: quantity must be a positive integer.`);
        continue;
      }

      let product;
      try {
        product = await Product.findById(productId);
      } catch {
        errors.push(`Item ${i + 1}: "${productId}" is not a valid product ID.`);
        continue;
      }

      if (!product) {
        errors.push(`Item ${i + 1}: No product found with ID "${productId}".`);
        continue;
      }

      if (product.stock < qty) {
        errors.push(
          `Item ${i + 1}: Insufficient stock for "${product.name}" (available: ${product.stock}, requested: ${qty}).`
        );
        continue;
      }

      orderItems.push({
        product: product._id,
        quantity: qty,
        priceAtOrder: product.price, // snapshot price at time of order
      });

      totalAmount += product.price * qty;
    }

    if (errors.length) {
      return res.status(400).json({ success: false, message: "Validation failed.", errors });
    }

    // ── Create the order ──────────────────────────────────────────────────
    const order = await Order.create({
      user: req.user.user_id,     // from JWT payload (set by verifyToken)
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress?.trim() || "",
    });

    // ── Deduct stock for each ordered item ────────────────────────────────
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Populate product names in the response
    await order.populate("items.product", "name category price");

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: {
        order: {
          id: order._id,
          status: order.status,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress,
          items: order.items,
          createdAt: order.createdAt,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error.", error: err.message });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// GET /api/v1/orders  (Protected — returns the logged-in user's orders)
// ────────────────────────────────────────────────────────────────────────────
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.user_id })
      .populate("items.product", "name category price image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        count: orders.length,
        orders,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error.", error: err.message });
  }
};
