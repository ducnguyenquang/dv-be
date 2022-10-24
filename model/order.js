const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  total: { type: Number, require },
  payment: { type: String, require },
  orderItems: [{type: mongoose.Schema.ObjectId, ref: 'order_item'}],
  orderNumber: { type: String, default: null, unique: true },
  status: { type: String },
  note: { type: String },
  customer: {type: mongoose.Schema.ObjectId, ref: 'customer'},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("order", orderSchema);
