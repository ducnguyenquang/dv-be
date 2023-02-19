const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, default: null },
  summary: { type: String, default: null },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("module", schema);
