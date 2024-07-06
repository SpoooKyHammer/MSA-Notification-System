const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { notificationsModel } = require("./../schema/notification");

const notificationRouter = Router();

notificationRouter.get("/", (req, res) => {
  res.send("hi")
})

module.exports = notificationRouter;
