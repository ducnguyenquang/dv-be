const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, default: null },
  slug: { type: String, default: null },
  description: { type: String, default: null },
  brand: { type: String, default: null },
  sku: { type: String, default: null, unique: true },
  images: { type: Array, default: [] },
  groups: [{type: mongoose.Schema.ObjectId, ref: 'category'}],
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("product", productSchema);
