const mongoose = require("mongoose");

const emailTemplateSchema = new mongoose.Schema({
  name: { type: String, default: null, unique: true },
  subject: { type: String, default: null},
  body: { type: String, default: null},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("email_template", emailTemplateSchema);
