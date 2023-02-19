const mongoose = require("mongoose");

const commonSchema = new mongoose.Schema({
  name: { type: String, default: null },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("common", commonSchema);
