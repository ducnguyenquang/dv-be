const mongoose = require("mongoose");

const popupMenuSchema = new mongoose.Schema({
  name: { type: String, default: null },
  icon: { type: String, default: null },
  url: { type: String, default: null },
  images: { type: Array, default: [] },
  isHidden: { type: Boolean, default: false },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("popup_menu", popupMenuSchema);
