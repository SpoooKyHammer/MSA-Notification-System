require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");

const notificationRouter = require("./router/notifications");
const { specs, swaggerUi } = require("./../swagger");
const jwtMiddleware = require("./middleware/jwt");

const PORT = process.env.NOTIFICATION_SERVICE_PORT;

const app = express();
app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(jwtMiddleware);
app.use("/api/notification", notificationRouter)

app.listen(PORT, () => console.log(`[NOTIFICATION_SERVICE] Listening on port: ${PORT}`))

mongoose.connect(process.env.DB_URI)
  .then(() => console.log("[DATABASE] Connected"))
  .catch(() => console.log("[DATABASE] Connection failed!"))
