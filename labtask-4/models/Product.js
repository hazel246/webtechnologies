const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Solar Panels", "Inverters", "Batteries", "Accessories", "Mounting Systems"],
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, default: "" },
    image: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
