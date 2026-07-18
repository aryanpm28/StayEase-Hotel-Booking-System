import { apiClient } from "./client";

export function login({ email, password }) {
  return apiClient.post("/auth/login", { email, password }).then((res) => res.data);
}

export function register(payload) {
  return apiClient.post("/customers", payload).then((res) => res.data);
}

export function getMyProfile() {
  return apiClient.get("/customers/me").then((res) => res.data);
}

export function updateMyProfile(payload) {
  return apiClient.put("/customers/me", payload).then((res) => res.data);
}
