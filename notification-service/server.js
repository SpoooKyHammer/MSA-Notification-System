require("dotenv").config()
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const notificationRouter = require("./router/notifications");
const jwtMiddleware = require("./middleware/jwt");
const { createTopic } = require("./service/kafka");

const PORT = process.env.NOTIFICATION_SERVICE_PORT;

const app = express();
app.use(express.json());
app.use(cors());
app.use(jwtMiddleware);
app.use("/api/notification", notificationRouter)

app.listen(PORT, () => console.log(`[NOTIFICATION_SERVICE] Listening on port: ${PORT}`))

mongoose.connect(process.env.DB_URI)
  .then(() => console.log("[DATABASE] Connected"))
  .catch(() => console.log("[DATABASE] Connection failed!"))

createTopic().catch((error) => {
  console.error('[KAFKA] Error creating topic:', error);
  process.exit(1);
})
