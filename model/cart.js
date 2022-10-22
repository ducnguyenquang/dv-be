const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  total: { type: Number},
  orderItems: [{type: mongoose.Schema.ObjectId, ref: 'order_item'}],
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("order", orderSchema);
