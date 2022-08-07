const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  quantity: { type: Number, require },
  total: { type: Number, require },
  order: {type: mongoose.Schema.ObjectId, ref: 'order'},
  product: {type: mongoose.Schema.ObjectId, ref: 'product'},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("order_item", orderItemSchema);
