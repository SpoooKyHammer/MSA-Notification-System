const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  message: String,
  read: Boolean
});

module.exports.notificationsModel = mongoose.model("notifications", notificationSchema);
