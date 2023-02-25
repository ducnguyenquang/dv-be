const mongoose = require("mongoose");

const commonSchema = new mongoose.Schema({
  name: { type: String, default: null },
  value: { type: String, default: null },
  type: { type: String, default: null },
  group: { type: String, default: null },
  active: { type: Boolean, default: null },
});

module.exports = mongoose.model("common", commonSchema);
