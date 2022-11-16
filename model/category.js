const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, default: null },
  slug: { type: String, default: null, unique: true },
  description: { type: String, default: null },
  type: { type: String, default: null },
  parentId: { type: mongoose.Schema.ObjectId, default: null, ref: 'category' },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("category", categorySchema);
