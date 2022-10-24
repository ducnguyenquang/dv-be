const mongoose = require("mongoose");

const tagSeoSchema = new mongoose.Schema({
  name: { type: String, default: null, unique: true },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("tag_seo", tagSeoSchema);
