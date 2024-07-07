const { Router } = require("express");
const { isUUID } = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { notificationsModel } = require("./../schema/notification");

const notificationRouter = Router();

notificationRouter.get("/", async (req, res) => {
  const notifications = await notificationsModel.find({_id: req.user.userId});
  res.json(notifications);
})

notificationRouter.get("/:id", async (req, res) => {
  if (!isUUID(req.params.id)) return res.status(422).json({error: "id must be a valid UUID."});

  const notification = await notificationsModel.findById(req.params.id);

  if (notification) return res.json(notification);

  res.status(404).json({error: "Notification not found with the requested id."})
})

notificationRouter.put("/:id", async (req, res) => {
  if (!isUUID(req.params.id)) return res.status(422).json({error: "id must be a valid UUID."});
  
  try {
    const notification = await notificationsModel.findByIdAndUpdate(req.params.id, {$set: {read: true}}, {new: true});

    if (notification) return res.json(notification);

    res.status(404).json({error: "Notification not found with the requested id to update."})
  } catch (error) {
    res.sendStatus(500)
  }
})


module.exports = notificationRouter;
