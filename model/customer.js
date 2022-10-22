const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, require },
  email: { type: String },
  phone: { type: String, require },
  city: { type: String, require },
  ward: { type: String, require },
  address: { type: String, require },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("customer", customerSchema);
