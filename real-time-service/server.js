require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const jwtMiddleware = require("./middleware/jwt");
const { runConsumer } = require("./service/kafka");

const server = http.createServer();
const io = new Server(server, { cors: {origin: "*"} });

io.use(jwtMiddleware)

/*
 * Connects user to their respective room where they recieve their notification only.
 * */
io.on("connection", (socket) => {
  console.log(`[WEBSOCKET_CLIENT] connected socketId: ${socket.id},  userId: ${socket.user.userId}`);
  
  socket.join(socket.user.userId);

  socket.on('disconnect', () => console.log(`[WEBSOCKET_CLIENT] disconnected socketId: ${socket.id},  userId: ${socket.user.userId}`));
});


const PORT = process.env.REALTIME_SERVICE_PORT;

async function main() {
  await runConsumer(io);
  console.log("[KAFKA_CONSUMER] Connected");
  server.listen(PORT, () => console.log(`[WEBSOCKET_SERVER] Listening on port: ${PORT}`));
}

main()
