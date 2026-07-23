import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

export const getBuses = () => api.get("/buses");

export const searchRoutes = (source, destination) =>
  api.get("/routes/search", {
    params: {
      source,
      destination,
    },
  });

export const predictSeat = (payload) =>
  api.post("/predict/seat", payload);

export default api;