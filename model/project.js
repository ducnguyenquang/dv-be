const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, default: null },
  slug: { type: String, default: null },
  description: { type: String, default: null },
  summary: { type: String, default: null },
  images: { type: Array, default: [] },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("project", projectSchema);
