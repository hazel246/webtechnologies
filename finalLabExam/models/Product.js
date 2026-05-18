const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: String, required: true, enum: ["Solar Panels","Inverters","Batteries","Accessories","Mounting Systems"] },
  rating:      { type: Number, default: 4, min: 1, max: 5 },
  stock:       { type: Number, default: 0, min: 0 },
  description: { type: String, default: "" },
  image:       { type: String, default: "" },
  isOnSale:    { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model("Product", productSchema);
