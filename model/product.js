const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, default: null },
  slug: { type: String, default: null },
  description: { type: String, default: null },
  summary: { type: String, default: null },
  specification: { type: String, default: null },
  brand: { type: mongoose.Schema.ObjectId, ref: 'brand', index: true, },
  sku: { type: String, default: null },
  images: { type: Array, default: [] },
  categories: {type: Array, ref: 'category', index: true,},
  pricing: { type: Number, default: 0 },
  type: { type: String, default: null },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});
// }, { strict: false });

// productSchema.index({ slug: 1, sku: 1 }, { unique: true });
module.exports = mongoose.model("product", productSchema);
