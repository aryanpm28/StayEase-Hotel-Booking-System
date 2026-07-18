import { apiClient } from "./client";

export function getRoomTypes() {
  return apiClient.get("/room-types").then((res) => res.data);
}

export function createRoomType(payload) {
  return apiClient.post("/room-types", payload).then((res) => res.data);
}

export function updateRoomType(id, payload) {
  return apiClient.put(`/room-types/${id}`, payload).then((res) => res.data);
}

export function deleteRoomType(id) {
  return apiClient.delete(`/room-types/${id}`).then((res) => res.data);
}
