const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  email: { type: String, unique: true, require },
  password: { type: String, require },
  token: { type: String },
  temporaryToken: { type: String },
  role: { type: String, require },
  phone: { type: Number, default: null },
  images: { type: Array, default: [] },
  status: { type: String, default: 'NEW'  },
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("user", userSchema);
