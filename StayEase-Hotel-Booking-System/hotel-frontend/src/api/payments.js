import { apiClient } from "./client";

export function makePayment(payload) {
  return apiClient.post("/payments", payload).then((res) => res.data);
}

export function getPayments() {
  return apiClient.get("/payments").then((res) => res.data);
}

export function getPaymentById(id) {
  return apiClient.get(`/payments/${id}`).then((res) => res.data);
}
