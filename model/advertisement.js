const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema({
  name: { type: String, default: null },
  url: { type: String, default: null, unique: true },
  image: { type: Array, default: [] },
  position: { type: String, default: null },
  isHidden: { type: Boolean, default: false },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("advertisement", advertisementSchema);
