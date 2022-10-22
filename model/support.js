const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({
  name: { type: String, default: null },
  title: { type: String, default: null },
  phone: { type: Array, default: [] },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("support", supportSchema);
