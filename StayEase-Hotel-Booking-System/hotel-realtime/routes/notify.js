const express = require("express");
const router = express.Router();

function getIo(req) {
  return req.app.get("io");
}

// New booking created -> tell admins, and confirm to the customer
router.post("/booking-created", (req, res) => {
  const { customerId, customerName, roomNumber, roomType, checkInDate, checkOutDate, totalPrice } =
    req.body || {};

  const io = getIo(req);

  const payload = {
    type: "booking-created",
    message: `${customerName || "A guest"} booked ${roomType || "a room"} (${roomNumber || ""})`,
    customerName,
    roomNumber,
    roomType,
    checkInDate,
    checkOutDate,
    totalPrice,
    timestamp: new Date().toISOString(),
  };

  io.to("admins").emit("notification", payload);

  if (customerId) {
    io.to(`customer:${customerId}`).emit("notification", {
      ...payload,
      message: `Your booking for ${roomType || "a room"} (${roomNumber || ""}) is confirmed`,
    });
  }

  res.json({ delivered: true });
});

// Booking cancelled -> tell admins, and confirm to the customer
router.post("/booking-cancelled", (req, res) => {
  const { customerId, customerName, roomNumber, bookingId } = req.body || {};

  const io = getIo(req);

  const payload = {
    type: "booking-cancelled",
    message: `${customerName || "A guest"} cancelled booking #${bookingId ?? ""} (${roomNumber || ""})`,
    customerName,
    roomNumber,
    bookingId,
    timestamp: new Date().toISOString(),
  };

  io.to("admins").emit("notification", payload);

  if (customerId) {
    io.to(`customer:${customerId}`).emit("notification", {
      ...payload,
      message: `Your booking #${bookingId ?? ""} has been cancelled`,
    });
  }

  res.json({ delivered: true });
});

// Payment completed -> tell admins, and confirm to the customer
router.post("/payment-completed", (req, res) => {
  const { customerId, customerName, amount, paymentStatus, bookingId } = req.body || {};

  const io = getIo(req);

  const payload = {
    type: "payment-completed",
    message: `Payment of ₹${amount ?? ""} for booking #${bookingId ?? ""} was ${
      paymentStatus || "processed"
    }`,
    customerName,
    amount,
    paymentStatus,
    bookingId,
    timestamp: new Date().toISOString(),
  };

  io.to("admins").emit("notification", payload);

  if (customerId) {
    io.to(`customer:${customerId}`).emit("notification", payload);
  }

  res.json({ delivered: true });
});

module.exports = router;
