const { Router } = require("express");
const { isUUID } = require("validator");

const { notificationsModel } = require("./../schema/notification");
const { produceMessage } = require("./../service/kafka");

const notificationRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API endpoints for managing notifications
 * 
 * securityDefinitions:
 *   BearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 *     description: Use 'Bearer <token>' as the value. 
 *     example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 */


/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Retrieve notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "6091b5e4f204a63eac7a939a"
 *                   userId:
 *                     type: string
 *                     example: "6091b5e4f204a63eac7a939b"
 *                   message:
 *                     type: string
 *                     example: "Notification message"
 *                   read:
 *                     type: boolean
 *                     example: false
 *       '401':
 *         description: Unauthorized - Invalid token
 *       '500':
 *         description: Internal server error
 */
notificationRouter.get("/", async (req, res) => {
  let notifications = await notificationsModel.find({userId: req.user.userId});
  let serialized = [];

  for (let notification of notifications) {
    serialized.push({_id: notification._id, userId: notification.userId, message: notification.message, read: notification.read});
  }
  
  res.json(serialized);
})

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification.
 *     description: Create a new notification for the authenticated user and produce a message to Kafka.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The message content of the notification.
 *             example:
 *               message: New notification message
 *     responses:
 *       200:
 *         description: Successfully created notification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the newly created notification.
 *                   example: 60e1b061c1c7cf001f50e84e
 *       400:
 *         description: Bad request. Missing message in request body.
 *       '401':
 *         description: Unauthorized - Invalid token
 */
notificationRouter.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) return res.sendStatus(400);

  const notification = new notificationsModel({
    userId: req.user.userId,
    message: message
  });
  await notification.save();
  
  await produceMessage(req.user.userId, message);

  res.json({_id: notification._id});
})


/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Get a notification by ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the notification to retrieve
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved the notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the notification
 *                 userId:
 *                   type: string
 *                   description: The ID of the user associated with the notification
 *                 message:
 *                   type: string
 *                   description: The notification message
 *                 read:
 *                   type: boolean
 *                   description: Whether the notification has been read
 *       '401':
 *         description: Unauthorized - Invalid token
 *       '404':
 *         description: Notification not found with the requested ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Notification not found with the requested id.
 *       '422':
 *         description: Invalid ID provided. ID must be a valid UUID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ID must be a valid UUID.
 */
notificationRouter.get("/:id", async (req, res) => {
  if (!isUUID(req.params.id)) return res.status(422).json({error: "id must be a valid UUID."});

  const notification = await notificationsModel.findById(req.params.id);

  if (notification) {
    return res.json({ _id: notification._id, userId: notification.userId, message: notification.message, read: notification.read });
  }

  res.status(404).json({error: "Notification not found with the requested id."})
})


/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the notification to update
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully updated the notification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the notification
 *                 userId:
 *                   type: string
 *                   description: The ID of the user associated with the notification
 *                 message:
 *                   type: string
 *                   description: The notification message
 *                 read:
 *                   type: boolean
 *                   description: Whether the notification has been read
 *       '401':
 *         description: Unauthorized - Invalid token
 *       '404':
 *         description: Notification not found with the requested ID to update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Notification not found with the requested id to update.
 *       '422':
 *         description: Invalid ID provided. ID must be a valid UUID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ID must be a valid UUID.
 *       '500':
 *         description: Internal server error
 */
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
