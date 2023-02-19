const mongoose = require("mongoose");

const topMenuSchema = new mongoose.Schema({
  name: { type: String, default: null },
  icon: { type: String, default: null, unique: true },
  url: { type: String, default: null },
  images: { type: Array, default: [] },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("top_menu", topMenuSchema);
