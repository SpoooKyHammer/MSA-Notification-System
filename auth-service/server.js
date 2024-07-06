require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");

const registerRouter = require("./router/register");
const loginRouter = require("./router/login");
const { specs, swaggerUi } = require("./../swagger");

const PORT = process.env.AUTH_SERVICE_PORT;

const app = express();
app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/register", registerRouter)
app.use("/api/login", loginRouter)

app.listen(PORT, () => console.log(`[AUTH_SERVICE] Listening on port: ${PORT}`))

mongoose.connect(process.env.DB_URI)
  .then(() => console.log("[DATABASE] Connected"))
  .catch(() => console.log("[DATABASE] Connection failed!"))
