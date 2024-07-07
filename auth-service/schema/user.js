const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  email: String,
  password: String,
  connected: {
    type: Boolean,
    default: false
  }
});

module.exports.usersModel = mongoose.model("users", userSchema);
