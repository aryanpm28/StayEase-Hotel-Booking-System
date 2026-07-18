import { apiClient } from "./client";

export function createBooking(payload) {
  return apiClient.post("/bookings", payload).then((res) => res.data);
}

export function getBookings() {
  return apiClient.get("/bookings").then((res) => res.data);
}

export function getBookingById(id) {
  return apiClient.get(`/bookings/${id}`).then((res) => res.data);
}

export function cancelBooking(id) {
  return apiClient.delete(`/bookings/${id}`).then((res) => res.data);
}
