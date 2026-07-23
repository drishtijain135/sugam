import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
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