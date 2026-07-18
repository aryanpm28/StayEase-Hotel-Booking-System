// Rooms used:
//  - "admins"            -> every connected admin dashboard
//  - `customer:{id}`     -> a specific customer's own notification channel

function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`[socket] connected: ${socket.id}`);

    socket.on("identify", ({ role, customerId } = {}) => {
      if (role === "ADMIN") {
        socket.join("admins");
        console.log(`[socket] ${socket.id} joined admins`);
      }

      if (customerId) {
        socket.join(`customer:${customerId}`);
        console.log(`[socket] ${socket.id} joined customer:${customerId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[socket] disconnected: ${socket.id}`);
    });
  });
}

module.exports = { registerSocketHandlers };
