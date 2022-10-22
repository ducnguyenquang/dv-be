const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { type: String, default: null },
  slug: { type: String, default: null, unique: true },
  description: { type: String, default: null },
  logo: { type: Array, default: [] },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("brand", brandSchema);
