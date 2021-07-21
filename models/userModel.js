const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, default: "", require: false },
  phone: { type: String, require: true },
  createdAt: { type: Date, default: Date() },
  status: { type: String, default: "", require: false },
  image: { type: String, default: "", require: false },
});

module.exports = new mongoose.model("user", userSchema);
