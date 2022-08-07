const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: { type: String, require },
  total: { type: Number, require },
  orderItems: [{type: mongoose.Schema.ObjectId, ref: 'order_item'}],
  orderNumber: { type: String, default: null, unique: true },
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'user'},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("order", orderSchema);
