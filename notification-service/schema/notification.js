const { randomUUID } = require("crypto");

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.SchemaTypes.UUID,
    default: randomUUID()
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  message: String,
  read: {
    type: Boolean,
    default: false
  }
});

module.exports.notificationsModel = mongoose.model("notifications", notificationSchema);
