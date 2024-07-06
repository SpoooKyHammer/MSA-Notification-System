const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  email: String,
  password: String,
  connected: Boolean
});

module.exports.usersModel = mongoose.model("users", userSchema);
