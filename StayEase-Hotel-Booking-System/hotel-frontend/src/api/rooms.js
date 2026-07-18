import { apiClient } from "./client";

export function getRooms() {
  return apiClient.get("/rooms").then((res) => res.data);
}

export function getAvailableRooms() {
  return apiClient.get("/rooms/available").then((res) => res.data);
}

export function getRoomById(id) {
  return apiClient.get(`/rooms/${id}`).then((res) => res.data);
}

export function searchRooms(payload) {
  return apiClient.post("/rooms/search", payload).then((res) => res.data);
}

export function createRoom(payload) {
  return apiClient.post("/rooms", payload).then((res) => res.data);
}

export function updateRoom(id, payload) {
  return apiClient.put(`/rooms/${id}`, payload).then((res) => res.data);
}

export function deleteRoom(id) {
  return apiClient.delete(`/rooms/${id}`).then((res) => res.data);
}
