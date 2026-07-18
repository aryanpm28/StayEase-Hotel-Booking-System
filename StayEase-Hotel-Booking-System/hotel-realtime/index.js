const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const notifyRouter = require("./routes/notify");
const { registerSocketHandlers } = require("./sockets");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// Make io available to routes via app locals
app.set("io", io);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "hotel-realtime" });
});

app.use("/api/notify", notifyRouter);

registerSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`StayEase realtime service listening on port ${PORT}`);
});
