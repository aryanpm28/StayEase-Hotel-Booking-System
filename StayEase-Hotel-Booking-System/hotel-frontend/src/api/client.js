import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("stayease_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Normalize error messages coming from the Spring Boot GlobalExceptionHandler
export function extractErrorMessage(error) {
  const data = error.response?.data;

  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  // Validation errors come back as a { field: message } map
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const values = Object.values(data).filter((v) => typeof v === "string");
    if (values.length) return values.join(" • ");
  }

  if (error.message) return error.message;
  return "Something went wrong. Please try again.";
}
